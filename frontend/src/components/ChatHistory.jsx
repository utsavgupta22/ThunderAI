import React, { useState } from 'react'

// Add CSS animations
const styleSheet = document.createElement("style")
styleSheet.innerText = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  /* Custom scrollbar styles */
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
  
  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #475569;
  }
  
  .neon-theme .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #39ff14;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
  
  .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
  
  .neon-theme .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #baffc9;
  }
`
if (!document.head.querySelector('style[data-chat-history]')) {
  styleSheet.setAttribute('data-chat-history', 'true')
  document.head.appendChild(styleSheet)
}

function ChatHistory({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat, onRenameChat }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  // Helper function to get chat ID consistently (supports both _id and id)
  const getChatId = (chat) => chat?._id || chat?.id

  const handleDelete = (chatId) => {
    onDeleteChat(chatId)
    setShowDeleteConfirm(null)
  }

  const handleNewChatClick = () => {
    setIsCreatingChat(true)
    setTimeout(() => setIsCreatingChat(false), 600)
    onNewChat()
  }

  const handleRename = (chatId) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim())
      setEditingChatId(null)
      setEditTitle('')
    }
  }

  const startEdit = (chat) => {
    setEditingChatId(getChatId(chat))
    setEditTitle(chat.title || 'Untitled Chat')
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-64 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] border-r border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] flex flex-col h-full transition-all duration-300">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14]">
        <button
          onClick={handleNewChatClick}
          disabled={isCreatingChat}
          className={`w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] text-white dark:text-white neon-theme:text-[#101d12] rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 ${
            isCreatingChat ? 'animate-pulse' : ''
          }`}
          title="Start a new conversation"
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isCreatingChat ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isCreatingChat ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 neon-theme:scrollbar-thumb-[#39ff14]">
        {chats.length === 0 ? (
          <div className="text-center py-8 px-4">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-400 dark:text-gray-500 neon-theme:text-[#8ffa70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 neon-theme:text-[#baffc9]">
              No chat history yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 neon-theme:text-[#8ffa70] mt-1">
              Start a new conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.filter((chat, index, self) => {
              const chatId = getChatId(chat)
              // Only include chats with a valid ID and remove duplicates
              return chatId && self.findIndex(c => getChatId(c) === chatId) === index
            }).map((chat) => {
              const chatId = getChatId(chat)
              return (
              <div key={chatId} className="relative group animate-slideIn">
                {editingChatId === chatId ? (
                  <div className="p-3 bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] rounded-lg border-2 border-blue-500">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRename(chatId)
                        } else if (e.key === 'Escape') {
                          setEditingChatId(null)
                          setEditTitle('')
                        }
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-gray-900 dark:text-white mb-2"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRename(chatId)}
                        className="flex-1 px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingChatId(null)
                          setEditTitle('')
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : showDeleteConfirm === chatId ? (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 neon-theme:bg-[#1a2f1d] rounded-lg border-2 border-red-500">
                    <p className="text-sm text-red-900 dark:text-red-200 mb-2">Delete this chat?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(chatId)}
                        className="flex-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-2 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    role="button" 
                    tabIndex={0}
                    className={`chat-history-item w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:translate-x-1 cursor-pointer hover:shadow-sm ${
                      currentChatId === chatId 
                        ? 'bg-blue-100 dark:bg-blue-900/20 neon-theme:bg-[#142a18] border-l-4 border-blue-500' 
                        : 'bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18]'
                    }`}
                    onClick={() => onSelectChat(chatId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelectChat(chatId)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="chat-history-title text-sm font-medium text-gray-900 dark:text-white neon-theme:text-[#39ff14] truncate transition-colors duration-200">
                          {chat.title || 'Untitled Chat'}
                        </h3>
                        <p className="chat-history-meta text-xs text-gray-500 dark:text-gray-400 neon-theme:text-[#baffc9] mt-1 transition-colors duration-200">
                          {chat.messageCount || chat.messages?.length || 0} messages
                        </p>
                        {chat.updatedAt && (
                          <p className="chat-history-meta text-xs text-gray-400 dark:text-gray-500 neon-theme:text-[#8ffa70] mt-1 transition-colors duration-200">
                            {formatDate(chat.updatedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
                        <button 
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 neon-theme:hover:bg-[#1a2f1d] rounded transition-all duration-200 transform hover:scale-110 active:scale-95"
                          title="Rename"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(chat)
                          }}
                        >
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 neon-theme:text-[#baffc9] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 neon-theme:hover:bg-[#1a2f1d] rounded transition-all duration-200 transform hover:scale-110 active:scale-95"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDeleteConfirm(chatId)
                          }}
                        >
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400 neon-theme:text-[#ff4444] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHistory
