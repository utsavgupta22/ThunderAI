import React, { useState, useRef, useEffect } from 'react'
import ChatWindow from '../components/ChatWindow'
import { buildApiUrl } from '../utils/api'
import InputArea from '../components/InputArea'
import FileUpload from '../components/FileUpload'
import UploadedFilesList from '../components/UploadedFilesList'
import Settings from '../components/Settings'
import BotSelector from '../components/BotSelector'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import ChatHistory from '../components/ChatHistory'
import ProcessingIndicator from '../components/ProcessingIndicator'

function Chat({ user, authToken, onLogout, onNavigateHome, onApiKeyUpdated }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [apiKey, setApiKey] = useState('')
  const [selectedBot, setSelectedBot] = useState('gemini')
  const [showSettings, setShowSettings] = useState(false)
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [showChatHistory, setShowChatHistory] = useState(true)
  const [processingStage, setProcessingStage] = useState(null)
  const [processingDetails, setProcessingDetails] = useState('')
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Set initial API key based on selected bot and user
  useEffect(() => {
    if (user) {
      const userApiKeys = {
        gemini: user.geminiApiKey,
        chatgpt: user.openaiApiKey,
        claude: user.claudeApiKey,
        perplexity: user.perplexityApiKey
      }
      // Set API key based on currently selected bot
      if (selectedBot === 'gemini' && userApiKeys.gemini) {
        setApiKey(userApiKeys.gemini)
      } else if (selectedBot === 'chatgpt' && userApiKeys.chatgpt) {
        setApiKey(userApiKeys.chatgpt)
      } else if (selectedBot === 'claude' && userApiKeys.claude) {
        setApiKey(userApiKeys.claude)
      } else if (selectedBot === 'perplexity' && userApiKeys.perplexity) {
        setApiKey(userApiKeys.perplexity)
      }
    }
  }, [user, selectedBot])

  // Load chat history on mount
  useEffect(() => {
    if (authToken) {
      loadChatHistory()
    }
  }, [authToken])

  const loadChatHistory = async () => {
    try {
      const response = await fetch(buildApiUrl('/chats'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats || [])
        console.log('Loaded chats:', data.chats?.length || 0)
      } else {
        console.error('Failed to load chats:', response.status)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const handleNewChat = async () => {
    // Save current chat before starting a new one
    if (currentChatId && messages.length > 0) {
      console.log('Saving current chat before creating new one')
      await saveCurrentChat(messages)
    }
    
    // Clear the current state - new chat will be created on first message
    setCurrentChatId(null)
    setMessages([])
    setUploadedFiles([])
    console.log('Ready for new chat')
  }

  const handleSelectChat = async (chatId) => {
    try {
      const response = await fetch(buildApiUrl(`/chats/${chatId}`), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded chat:', chatId, 'with', data.chat.messages?.length || 0, 'messages')
        setCurrentChatId(chatId)
        setMessages(data.chat.messages || [])
        setUploadedFiles(data.chat.uploadedFiles || [])
      } else {
        console.error('Failed to load chat:', response.status)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(buildApiUrl(`/chats/${chatId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (response.ok) {
        if (currentChatId === chatId) {
          setCurrentChatId(null)
          setMessages([])
          setUploadedFiles([])
        }
        await loadChatHistory()
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      const response = await fetch(buildApiUrl(`/chats/${chatId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ title: newTitle })
      })
      
      if (response.ok) {
        await loadChatHistory()
      }
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }

  const saveCurrentChat = async (newMessages) => {
    if (!authToken) {
      console.log('Not saving chat - no auth token')
      return // Don't save if not logged in
    }
    
    if (!currentChatId) {
      // Create new chat if doesn't exist
      try {
        // Generate a title from the first user message
        const firstUserMessage = newMessages.find(m => m.sender === 'user')
        const title = firstUserMessage?.text?.substring(0, 50) || 'New Conversation'
        
        console.log('Creating new chat with title:', title)
        
        const response = await fetch(buildApiUrl('/chats'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            title,
            messages: newMessages,
            uploadedFiles
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          // Backend returns _id, use it consistently
          const newChatId = data.chat._id || data.chat.id
          console.log('Chat created successfully:', newChatId)
          setCurrentChatId(newChatId)
          await loadChatHistory()
          return newChatId
        } else {
          console.error('Failed to create chat:', response.status)
        }
      } catch (error) {
        console.error('Error creating chat:', error)
      }
    } else {
      // Update existing chat
      try {
        console.log('Updating chat:', currentChatId, 'with', newMessages.length, 'messages')
        
        const response = await fetch(buildApiUrl(`/chats/${currentChatId}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            messages: newMessages,
            uploadedFiles
          })
        })
        
        if (response.ok) {
          console.log('Chat updated successfully')
          await loadChatHistory()
        } else {
          console.error('Failed to update chat:', response.status)
        }
      } catch (error) {
        console.error('Error updating chat:', error)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Use onApiKeyUpdated from props (App.jsx) to update user and keys globally

  const handleFileUpload = async (files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      setLoading(true)
      setProcessingStage('uploading')
      setProcessingDetails(`Preparing to upload ${files.length} file(s)...`)
      setUploadProgress(10)
      
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(30)
      setProcessingDetails(`Uploading ${files.map(f => f.name).join(', ')}...`)
      
      const response = await fetch(buildApiUrl('/upload'), {
        method: 'POST',
        body: formData
      })
      
      setUploadProgress(70)
      setProcessingStage('analyzing')
      setProcessingDetails('Server processing files...')
      
      await new Promise(resolve => setTimeout(resolve, 300))

      if (response.ok) {
        const data = await response.json()
        setUploadedFiles([...uploadedFiles, ...data.files])
        setUploadProgress(90)
        setProcessingDetails('Finalizing upload...')
        
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(100)
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `✅ Successfully uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`,
          sender: 'system',
          timestamp: new Date()
        }])

        setTimeout(() => {
          setUploadProgress(0)
          setProcessingStage(null)
          setProcessingDetails('')
        }, 1000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `❌ Error uploading files: ${error.message}`,
        sender: 'system',
        timestamp: new Date()
      }])
      setProcessingStage(null)
      setProcessingDetails('')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)
    
    // Show detailed processing stages
    setProcessingStage('thinking')
    setProcessingDetails('Preparing your request...')
    
    await new Promise(resolve => setTimeout(resolve, 300))

    const loadingMessage = {
      id: Date.now() + 1,
      text: '',
      sender: 'assistant',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, loadingMessage])

    try {
      // Show file searching stage if files are uploaded
      if (uploadedFiles.length > 0) {
        setProcessingStage('scanning')
        setProcessingDetails(`Preparing to scan ${uploadedFiles.length} file(s)...`)
        await new Promise(resolve => setTimeout(resolve, 400))
        
        setProcessingStage('reading')
        setProcessingDetails(`Reading file contents...`)
        await new Promise(resolve => setTimeout(resolve, 400))
        
        setProcessingStage('understanding')
        setProcessingDetails(`Understanding code structure...`)
        await new Promise(resolve => setTimeout(resolve, 400))
      }

      setProcessingStage('processing')
      setProcessingDetails('Connecting to AI model...')

      const response = await fetch(buildApiUrl('/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          message,
          apiKey,
          uploadedFiles,
          provider: selectedBot,
          conversationHistory: messages
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      setProcessingStage('generating')
      setProcessingDetails('Receiving response from AI...')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''
      let buffer = ''
      let lastUpdate = Date.now()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // Process SSE events
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'progress') {
                // Update processing stage from backend
                setProcessingStage(data.stage)
                setProcessingDetails(data.details)
              } else if (data.type === 'done') {
                // Clear processing indicators when done
                setProcessingStage(null)
                setProcessingDetails('')
              } else if (data.type === 'error') {
                setProcessingStage(null)
                setProcessingDetails('')
              }
            } catch (e) {
              // Not a JSON line, it's actual content
            }
          } else if (line.trim() && !line.startsWith('data:')) {
            // Regular text content - add word by word
            accumulatedText += line + '\n'
            
            // Throttle updates to create smooth streaming effect
            // Update every 50ms for smooth appearance
            const now = Date.now()
            if (now - lastUpdate > 50 || true) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: accumulatedText
                }
                return updated
              })
              lastUpdate = now
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim() && !buffer.startsWith('data:')) {
        accumulatedText += buffer
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: accumulatedText
          }
          return updated
        })
      }

      // Clear processing indicators
      setProcessingStage(null)
      setProcessingDetails('')

      // Save chat after receiving response
      const finalMessages = [...newMessages, {
        id: Date.now() + 1,
        text: accumulatedText,
        sender: 'assistant',
        timestamp: new Date()
      }]
      await saveCurrentChat(finalMessages)

    } catch (error) {
      console.error('Chat error:', error)
      setProcessingStage(null)
      setProcessingDetails('')
      
      // Check if it was aborted
      if (error.name === 'AbortError') {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: (updated[updated.length - 1].text || '') + '\n\n⚠️ *Response stopped by user*',
            sender: 'assistant'
          }
          return updated
        })
      } else {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: `❌ Error: ${error.message}`,
            sender: 'error'
          }
          return updated
        })
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setLoading(false)
      setProcessingStage(null)
      setProcessingDetails('')
    }
  }

  const handleRemoveFile = (fileName) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== fileName))
  }

  const handleBotSelect = (botId) => {
    console.log('Switching to bot:', botId)
    setSelectedBot(botId)
    
    if (user) {
      let newApiKey = ''
      if (botId === 'gemini' && user.geminiApiKey) {
        newApiKey = user.geminiApiKey
      } else if (botId === 'chatgpt' && user.openaiApiKey) {
        newApiKey = user.openaiApiKey
      } else if (botId === 'claude' && user.claudeApiKey) {
        newApiKey = user.claudeApiKey
      } else if (botId === 'perplexity' && user.perplexityApiKey) {
        newApiKey = user.perplexityApiKey
      }
      
      console.log('Setting API key for', botId, ':', newApiKey ? 'Found' : 'Not found')
      setApiKey(newApiKey)
    }
  }

  const userApiKeys = user ? {
    gemini: user.geminiApiKey,
    chatgpt: user.openaiApiKey,
    claude: user.claudeApiKey,
    perplexity: user.perplexityApiKey
  } : {}

  return (
    <div className="App min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 neon-theme:from-[#101d12] neon-theme:via-[#1a2f1d] neon-theme:to-[#101d12]">
      <header className="bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] border-b border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] px-6 py-4 sticky top-0 z-10 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Toggle Chat History Button */}
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18] rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
              title={showChatHistory ? 'Hide chat history' : 'Show chat history'}
            >
              <svg className={`w-6 h-6 text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14] transition-transform duration-300 ${showChatHistory ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome} title="Go to Home">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-2xl flex items-center justify-center border-2 border-gray-800 dark:border-gray-600 neon-theme:border-[#39ff14]">
                  <span className="text-3xl">🤖</span>
                </div>
              </div>
              <span className="text-xl font-bold transition-colors duration-300 text-gray-800 dark:text-white neon-theme:text-[#39ff14]">
                <span className="transition-colors duration-300 text-purple-700 dark:text-purple-400 neon-theme:text-[#39ff14]">THUNDER BOLT</span>
                <span className="ml-1 transition-colors duration-300 text-gray-800 dark:text-gray-200 neon-theme:text-[#39ff14]">AI ⚡</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <UserMenu 
                user={user}
                onSettings={() => setShowSettings(true)}
                onLogout={onLogout}
                lightNameBg // Pass a prop to indicate light theme for name background
              />
            )}
            <ThemeToggle />
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 neon-theme:text-[#baffc9] hover:text-gray-900 dark:hover:text-gray-100 neon-theme:hover:text-[#39ff14] text-sm font-medium transition"
            >
              Home
            </button>
            {/* Removed Settings and Logout buttons from header; available in UserMenu dropdown */}
          </div>
        </div>
      </header>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-blue-50 dark:bg-blue-900 neon-theme:bg-[#142a18] border-b border-blue-100 dark:border-blue-800 neon-theme:border-[#39ff14] px-6 py-3">
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 neon-theme:border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-200 neon-theme:text-[#39ff14]">Uploading files...</span>
            </div>
            <div className="flex-1 bg-blue-200 dark:bg-blue-700 neon-theme:bg-[#39ff14] rounded-full h-2 overflow-hidden max-w-xs">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-200 neon-theme:text-[#39ff14]">{uploadProgress}%</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Chat History Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${showChatHistory ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          {showChatHistory && (
            <ChatHistory
              chats={chats}
              currentChatId={currentChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
            />
          )}
        </div>

        <div className="flex-1 flex gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Main Chat Area with scroll */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 h-full max-h-[calc(100vh-120px)]">
          {/* Chat Title/Status Bar */}
          {currentChatId && (
            <div className="bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] rounded-lg px-4 py-2 border border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] animate-fadeIn transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14]">
                    {chats.find(c => (c._id || c.id) === currentChatId)?.title || 'Current Chat'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 neon-theme:text-[#8ffa70]">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ChatWindow 
              messages={messages} 
              messagesEndRef={messagesEndRef} 
              loading={loading} 
              processingStage={processingStage}
              processingDetails={processingDetails}
            />
          </div>
          <div className="relative">
            <InputArea onSendMessage={handleSendMessage} disabled={loading} />
            {loading && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleStopGeneration}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition flex items-center gap-2 animate-pulse"
                  title="Stop generating"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop Generating
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4 flex-shrink-0">
          {/* File Upload */}
          <FileUpload onFileUpload={handleFileUpload} disabled={loading} />
          
          {/* Uploaded Files List */}
          <UploadedFilesList
            files={uploadedFiles}
            onRemoveFile={handleRemoveFile}
            onClearAll={() => {
              setUploadedFiles([])
              setMessages(prev => [...prev, {
                id: Date.now(),
                text: '🗑️ All files cleared. You can now ask general questions without file context.',
                sender: 'system',
                timestamp: new Date()
              }])
            }}
          />
          
          {/* AI Model Option Buttons (Gemini & others) */}
          <div className="rounded-xl p-4 border border-blue-100 dark:border-blue-800 neon-theme:border-[#39ff14] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 neon-theme:from-[#142a18] neon-theme:to-[#1a2f1d] transition-colors duration-300">
            <h4 className="font-semibold text-gray-800 dark:text-white neon-theme:text-[#39ff14] mb-3 text-sm">🤖 Select AI Model</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Gemini */}
              <button
                onClick={() => userApiKeys.gemini && handleBotSelect('gemini')}
                disabled={!userApiKeys.gemini}
                title={userApiKeys.gemini ? '' : 'Add Gemini API key in Settings'}
                className={`aspect-square w-full flex flex-col items-center justify-center p-0 rounded-xl border-2 transition-all font-medium text-base h-28 md:h-32 lg:h-28 xl:h-32
                  ${selectedBot === 'gemini' && userApiKeys.gemini
                    ? 'border-purple-500 bg-white dark:bg-slate-900 neon-theme:bg-[#1a2f1d] text-purple-700 dark:text-purple-300 neon-theme:text-[#39ff14]'
                    : userApiKeys.gemini
                    ? 'border-purple-200 bg-white dark:bg-slate-900 neon-theme:bg-[#1a2f1d] text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14] hover:border-purple-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-200 bg-gray-50 dark:bg-slate-900 neon-theme:bg-[#101d12] text-gray-400 dark:text-gray-500 neon-theme:text-[#baffc9] opacity-60 cursor-not-allowed'
                }`}
              >
                <img src="/assets/gemini.jpeg" alt="Gemini Logo" className="w-11 h-11 mb-2 rounded-full object-cover shadow" />
                <span className="font-semibold">Gemini</span>
                {selectedBot === 'gemini' && userApiKeys.gemini && <span className="text-green-500 text-lg">✓</span>}
                {!userApiKeys.gemini && <span className="text-xs text-red-500 dark:text-red-400 neon-theme:text-[#baffc9]">Add Key</span>}
              </button>
              {/* ChatGPT */}
              <button
                onClick={() => userApiKeys.chatgpt && handleBotSelect('chatgpt')}
                disabled={!userApiKeys.chatgpt}
                title={userApiKeys.chatgpt ? '' : 'Add ChatGPT API key in Settings'}
                className={`aspect-square w-full flex flex-col items-center justify-center p-0 rounded-xl border-2 transition-all font-medium text-base h-28 md:h-32 lg:h-28 xl:h-32
                  ${selectedBot === 'chatgpt' && userApiKeys.chatgpt
                    ? 'border-green-500 bg-green-50 dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-green-700 dark:text-green-300 neon-theme:text-[#39ff14]'
                    : userApiKeys.chatgpt
                    ? 'border-green-200 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14] hover:border-green-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-200 bg-gray-50 dark:bg-slate-900 neon-theme:bg-[#101d12] text-gray-400 dark:text-gray-500 neon-theme:text-[#baffc9] opacity-60 cursor-not-allowed'
                }`}
              >
                <img src="/assets/chatgpt.jpeg" alt="ChatGPT Logo" className="w-11 h-11 mb-2 rounded-full object-cover shadow" />
                <span className="font-semibold">ChatGPT</span>
                {selectedBot === 'chatgpt' && userApiKeys.chatgpt && <span className="text-green-500 text-lg">✓</span>}
                {!userApiKeys.chatgpt && <span className="text-xs text-red-500 dark:text-red-400 neon-theme:text-[#baffc9]">Add Key</span>}
              </button>
              {/* Perplexity */}
              <button
                onClick={() => userApiKeys.perplexity && handleBotSelect('perplexity')}
                disabled={!userApiKeys.perplexity}
                title={userApiKeys.perplexity ? '' : 'Add Perplexity API key in Settings'}
                className={`aspect-square w-full flex flex-col items-center justify-center p-0 rounded-xl border-2 transition-all font-medium text-base h-28 md:h-32 lg:h-28 xl:h-32
                  ${selectedBot === 'perplexity' && userApiKeys.perplexity
                    ? 'border-blue-500 bg-blue-50 dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-blue-700 dark:text-blue-300 neon-theme:text-[#39ff14]'
                    : userApiKeys.perplexity
                    ? 'border-blue-200 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14] hover:border-blue-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-200 bg-gray-50 dark:bg-slate-900 neon-theme:bg-[#101d12] text-gray-400 dark:text-gray-500 neon-theme:text-[#baffc9] opacity-60 cursor-not-allowed'
                }`}
              >
                <img src="/assets/perplexity.avif" alt="Perplexity Logo" className="w-11 h-11 mb-2 rounded-full object-cover shadow" />
                <span className="font-semibold">Perplexity</span>
                {selectedBot === 'perplexity' && userApiKeys.perplexity && <span className="text-green-500 text-lg">✓</span>}
                {!userApiKeys.perplexity && <span className="text-xs text-red-500 dark:text-red-400 neon-theme:text-[#baffc9]">Add Key</span>}
              </button>
              {/* Claude */}
              <button
                onClick={() => userApiKeys.claude && handleBotSelect('claude')}
                disabled={!userApiKeys.claude}
                title={userApiKeys.claude ? '' : 'Add Claude API key in Settings'}
                className={`aspect-square w-full flex flex-col items-center justify-center p-0 rounded-xl border-2 transition-all font-medium text-base h-28 md:h-32 lg:h-28 xl:h-32
                  ${selectedBot === 'claude' && userApiKeys.claude
                    ? 'border-orange-500 bg-orange-50 dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-orange-700 dark:text-orange-300 neon-theme:text-[#39ff14]'
                    : userApiKeys.claude
                    ? 'border-orange-200 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] text-gray-700 dark:text-gray-200 neon-theme:text-[#39ff14] hover:border-orange-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-200 bg-gray-50 dark:bg-slate-900 neon-theme:bg-[#101d12] text-gray-400 dark:text-gray-500 neon-theme:text-[#baffc9] opacity-60 cursor-not-allowed'
                }`}
              >
                <img src="/assets/claude.png" alt="Claude Logo" className="w-11 h-11 mb-2 rounded-full object-cover shadow" />
                <span className="font-semibold">Claude</span>
                {selectedBot === 'claude' && userApiKeys.claude && <span className="text-green-500 text-lg">✓</span>}
                {!userApiKeys.claude && <span className="text-xs text-red-500 dark:text-red-400 neon-theme:text-[#baffc9]">Add Key</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Settings Modal */}
      {showSettings && user && (
        <Settings 
          user={user} 
          authToken={authToken}
          onClose={() => setShowSettings(false)}
          onApiKeysUpdated={onApiKeyUpdated}
        />
      )}
    </div>
  )
}

export default Chat
