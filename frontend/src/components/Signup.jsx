import React, { useState } from 'react'
import { buildApiUrl } from '../utils/api'

function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(buildApiUrl('/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, geminiApiKey })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      // Store token and user data
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // If user provided API key, also store it
      if (data.user.geminiApiKey) {
        localStorage.setItem('gemini_api_key', data.user.geminiApiKey)
      }

      onSignup(data.user, data.token)
    } catch (err) {
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 overflow-y-auto relative">
      {/* Floating Background Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[8%] w-28 h-28 bg-green-400 rounded-full opacity-10 animate-float-slow"></div>
        <div className="absolute top-[60%] left-[5%] w-24 h-24 bg-emerald-400 rounded-full opacity-10 animate-float-medium"></div>
        <div className="absolute bottom-[10%] right-[15%] w-20 h-20 bg-teal-400 rounded-full opacity-10 animate-bounce-fast"></div>
        <div className="absolute top-[30%] left-[10%] text-6xl opacity-5 animate-float-medium">🚀</div>
        <div className="absolute bottom-[35%] right-[25%] text-5xl opacity-5 animate-float-slow">✨</div>
        <div className="absolute top-[50%] right-[5%] text-4xl opacity-5 animate-bounce-medium">🎯</div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full border border-gray-200 my-4 animate-slideUp relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center border border-gray-300 shadow-md animate-scaleIn">
            <span className="text-3xl">✨</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-5 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h1>
          <p className="text-gray-600">
            
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="John Doe"
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder="Re-enter password"
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Gemini API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value)
                  setError('')
                }}
                placeholder="AIzaSy... (optional)"
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showApiKey ? '🔓' : '🔒'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">You can add this later in settings</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-2 rounded-lg transition shadow-md disabled:shadow-none text-sm"
          >
            {loading ? '🔄 Creating Account...' : 'Create Account →'}
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Creator Signature */}
          <div className="text-center pt-1">
            <p className="text-xs text-gray-500">
              Created by <span className="text-purple-600 font-semibold"></span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
