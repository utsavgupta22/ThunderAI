import React, { useState, useEffect } from 'react'
import { buildApiUrl } from '../utils/api'

function Settings({ user, authToken, onClose, onApiKeysUpdated }) {
  const [geminiApiKey, setGeminiApiKey] = useState(user.geminiApiKey || '')
  const [openaiApiKey, setOpenaiApiKey] = useState(user.openaiApiKey || '')
  const [perplexityApiKey, setPerplexityApiKey] = useState(user.perplexityApiKey || '')
  const [claudeApiKey, setClaudeApiKey] = useState(user.claudeApiKey || '')
  
  const [showGemini, setShowGemini] = useState(false)
  const [showOpenai, setShowOpenai] = useState(false)
  const [showPerplexity, setShowPerplexity] = useState(false)
  const [showClaude, setShowClaude] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Update local state when user prop changes (after API keys are saved)
  useEffect(() => {
    if (user) {
      setGeminiApiKey(user.geminiApiKey || '')
      setOpenaiApiKey(user.openaiApiKey || '')
      setPerplexityApiKey(user.perplexityApiKey || '')
      setClaudeApiKey(user.claudeApiKey || '')
    }
  }, [user])

  const handleSaveApiKeys = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    setError('')
    setSuccess('')

    console.log('Saving API keys:', {
      gemini: geminiApiKey ? 'Set' : 'Not set',
      openai: openaiApiKey ? 'Set' : 'Not set',
      perplexity: perplexityApiKey ? 'Set' : 'Not set',
      claude: claudeApiKey ? 'Set' : 'Not set'
    })

    try {
      const response = await fetch(buildApiUrl('/auth/update-api-keys'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          geminiApiKey,
          openaiApiKey,
          perplexityApiKey,
          claudeApiKey
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to save API keys:', data.error)
        setError(data.error || 'Failed to save API keys')
        setLoading(false)
        return
      }

      console.log('API keys saved successfully!')
      setSuccess('✅ API keys saved successfully!')
      
      // Update localStorage
      if (geminiApiKey) localStorage.setItem('gemini_api_key', geminiApiKey)
      
      // Update parent component
      if (onApiKeysUpdated) {
        console.log('Calling onApiKeysUpdated...')
        onApiKeysUpdated({
          geminiApiKey,
          openaiApiKey,
          perplexityApiKey,
          claudeApiKey
        })
      }

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Error saving API keys:', err)
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSaveApiKeys} className="space-y-4 max-h-96 overflow-y-auto">
          {/* Gemini API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>✨</span> Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showGemini ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showGemini ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">Google AI Studio</a>
            </p>
          </div>

          {/* ChatGPT API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>💬</span> ChatGPT (OpenAI) API Key
            </label>
            <div className="relative">
              <input
                type={showOpenai ? 'text' : 'password'}
                value={openaiApiKey}
                onChange={(e) => {
                  setOpenaiApiKey(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOpenai ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">OpenAI Platform</a>
            </p>
          </div>

          {/* Perplexity API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🔍</span> Perplexity API Key
            </label>
            <div className="relative">
              <input
                type={showPerplexity ? 'text' : 'password'}
                value={perplexityApiKey}
                onChange={(e) => {
                  setPerplexityApiKey(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="pplx-..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPerplexity(!showPerplexity)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPerplexity ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Perplexity Settings</a>
            </p>
          </div>

          {/* Claude API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>🧠</span> Claude (Anthropic) API Key
            </label>
            <div className="relative">
              <input
                type={showClaude ? 'text' : 'password'}
                value={claudeApiKey}
                onChange={(e) => {
                  setClaudeApiKey(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowClaude(!showClaude)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showClaude ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get from: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">Anthropic Console</a>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition font-medium"
            >
              {loading ? '💾 Saving...' : 'Save API Keys'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
