import React, { useState, useRef, useEffect } from 'react'
import ChatPage from './pages/Chat'
import Hero from './components/Hero'
import Login from './components/Login'
import Signup from './components/Signup'
import ApiKeyInput from './components/ApiKeyInput'
import { buildApiUrl } from './utils/api'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [user, setUser] = useState(null)
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedBot, setSelectedBot] = useState('gemini') // Track which bot is selected
  const messagesEndRef = useRef(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setAuthToken(storedToken)
        
        // If user has API key stored, use it
        if (parsedUser.geminiApiKey) {
          setApiKey(parsedUser.geminiApiKey)
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLogin = (userData, token) => {
    setUser(userData)
    setAuthToken(token)
    if (userData.geminiApiKey) {
      setApiKey(userData.geminiApiKey)
    }
    setShowLogin(false)
    setShowSignup(false)
    setShowChat(true)
  }

  const handleSignup = (userData, token) => {
    setUser(userData)
    setAuthToken(token)
    if (userData.geminiApiKey) {
      setApiKey(userData.geminiApiKey)
    }
    setShowSignup(false)
    setShowLogin(false)
    setShowChat(true)
  }

  const handleLogout = () => {
    setUser(null)
    setAuthToken('')
    setApiKey('')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('gemini_api_key')
    setShowChat(false)
    setShowLogin(false)
    setShowSignup(false)
    setMessages([])
  }

  const handleApiKeyUpdated = async (newKeys) => {
    // Refresh user data from server to get all updated keys
    console.log('Refreshing user data after API key update...')
    try {
      const response = await fetch(buildApiUrl('/auth/me'), {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const userData = data.user || data // Handle both { user: {...} } and direct user object
        console.log('Updated user data:', userData)
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Update the current API key if it's for the selected bot
        if (selectedBot === 'gemini' && userData.geminiApiKey) {
          setApiKey(userData.geminiApiKey)
        } else if (selectedBot === 'chatgpt' && userData.openaiApiKey) {
          setApiKey(userData.openaiApiKey)
        } else if (selectedBot === 'claude' && userData.claudeApiKey) {
          setApiKey(userData.claudeApiKey)
        } else if (selectedBot === 'perplexity' && userData.perplexityApiKey) {
          setApiKey(userData.perplexityApiKey)
        }
      } else {
        console.error('Failed to fetch updated user data:', response.status)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const handleApiKeySubmit = (key) => {
    setApiKey(key)
    localStorage.setItem('gemini_api_key', key)
    setShowApiKeyInput(false)
    setShowChat(true) // After API key is set, go to chat
  }

  const handleGetStarted = () => {
    if (user) {
      setShowChat(true)
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className="App">
      {showLogin ? (
        <Login onLogin={handleLogin} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />
      ) : showSignup ? (
        <Signup onSignup={handleSignup} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />
      ) : showApiKeyInput ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : showChat && user ? (
        <ChatPage 
          user={user}
          authToken={authToken}
          onLogout={handleLogout}
          onNavigateHome={() => setShowChat(false)}
          onApiKeyUpdated={handleApiKeyUpdated}
        />
      ) : (
        <Hero 
          onGetStarted={handleGetStarted}
          user={user}
          authToken={authToken}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App