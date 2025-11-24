import React, { useState } from 'react'
import { buildApiUrl } from '../utils/api'

function ApiKeyInput({ onSubmit }) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      setError('API key cannot be empty')
      return
    }
    if (!apiKey.startsWith('AIzaSy')) {
      setError('Invalid Gemini API key format. Key should start with "AIzaSy"')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Test the API key first
      const response = await fetch(buildApiUrl('/test-api-key'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(`API key validation failed: ${data.error || 'Unknown error'}`)
        setLoading(false)
        return
      }

      // If valid, proceed to chat
      onSubmit(apiKey)
    } catch (err) {
      setError(`Error connecting to server: ${err.message}. Make sure backend is running on localhost:5000`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg w-full border border-gray-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center border border-gray-300 shadow-md">
            <span className="text-4xl">🔑</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AI CodeHub
          </h1>
          <p className="text-gray-600">
            Enter your Gemini API key to get started
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError('')
                }}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {loading ? '🔄 Testing API Key...' : 'Continue to Chat →'}
          </button>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-blue-800">
                <p className="font-semibold mb-1">Get Your Free API Key</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700 ml-1">
                  <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Google AI Studio</a></li>
                  <li>Click "Create API Key"</li>
                  <li>Copy and paste it above</li>
                  <li>Start using AI CodeHub!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm text-green-800">
              🔒 Your API key is stored locally and never sent to our servers
            </p>
          </div>
          
          {/* Creator Signature */}
          {/* <div className="text-center pt-1">
            <p className="text-xs text-gray-500">
              Created by <span className="text-purple-600 font-semibold"></span>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  )
}

export default ApiKeyInput
