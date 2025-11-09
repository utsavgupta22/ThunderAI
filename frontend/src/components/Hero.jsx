import React, { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import Settings from './Settings'

function Hero({ onGetStarted, user, authToken, onLogout }) {
  const [showSettings, setShowSettings] = useState(false)

  const handleApiKeyUpdated = () => {
    setShowSettings(false)
    window.location.reload() // Refresh to get updated user data
  }

  return (
  <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 neon-theme:from-[#101d12] neon-theme:via-[#1a2f1d] neon-theme:to-[#101d12]">
      {/* Header */}
  <header className="bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] border-b border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] px-6 py-4 sticky top-0 z-10 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-2xl flex items-center justify-center border-2 border-gray-800 dark:border-gray-600 neon-theme:border-[#39ff14]">
                <span className="text-3xl text-gray-800 dark:text-white neon-theme:text-[#39ff14]">🤖</span>
              </div>
            </div>
            <span className="text-xl font-bold transition-colors duration-300
              text-gray-800 dark:text-white neon-theme:text-[#39ff14]">
              <span className="transition-colors duration-300 text-purple-700 dark:text-purple-400 neon-theme:text-[#39ff14]">THUNDER BOLT</span>
              <span className="ml-1 transition-colors duration-300 text-gray-800 dark:text-gray-200 neon-theme:text-[#39ff14]">AI ⚡</span>
              <span className="align-middle transition-colors duration-300 text-gray-800 dark:text-white neon-theme:text-[#39ff14]"> </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <UserMenu 
                user={user}
                onSettings={() => setShowSettings(true)}
                onLogout={onLogout}
              />
            )}
            <ThemeToggle />
            <button
              onClick={onGetStarted}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] dark:hover:from-green-700 dark:hover:to-emerald-800 text-white dark:text-white neon-theme:text-[#101d12] rounded-xl font-semibold border-2 border-gray-800 dark:border-gray-600 neon-theme:border-[#39ff14] transition shadow-md hover:shadow-lg"
            >
              {user ? '🚀 START CHATTING' : '🚀 START NOW'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900 neon-theme:bg-[#142a18] border-2 border-purple-400 dark:border-purple-600 neon-theme:border-[#39ff14] text-purple-800 dark:text-purple-200 neon-theme:text-[#39ff14] rounded-full text-sm font-semibold">
                ⚡ Powered by Google Gemini AI
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white neon-theme:text-[#39ff14]">
                Multi-AI{' '}
                <span className="text-purple-600 dark:text-purple-400 neon-theme:text-[#baffc9]">
                  Chat
                </span>{' '}
                Platform
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 neon-theme:text-[#baffc9] leading-relaxed">
                One platform, multiple AI models. Chat with Gemini, ChatGPT, Claude & Perplexity.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGetStarted}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] text-white dark:text-white neon-theme:text-[#101d12] rounded-lg font-semibold border-2 border-gray-800 dark:border-gray-600 neon-theme:border-[#39ff14] transition shadow-lg hover:shadow-xl"
              >
                🎯 Get Started →
              </button>
              <a
                href="#features"
                className="px-10 py-4 bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-900 dark:text-white neon-theme:text-[#39ff14] rounded-lg font-semibold transition border-2 border-gray-800 dark:border-gray-600 neon-theme:border-[#39ff14] hover:shadow-lg"
              >
                📚 Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4">
              <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 neon-theme:text-[#39ff14]">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">Languages</div>
              </div>
              <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 neon-theme:text-[#39ff14]">⚡</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">Real-time</div>
              </div>
              <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 neon-theme:text-[#39ff14]">Free</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">Always</div>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            <div className="relative bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] rounded-2xl shadow-lg border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] p-8">
              <div className="text-center space-y-4">
                <div className="text-8xl">🤖</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14]">Your AI Code Partner</h3>
                  <p className="text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">Upload files, ask questions, get instant help</p>
                </div>
                
                {/* Feature Pills */}
                <div className="flex justify-center gap-2 flex-wrap pt-4">
                  <span className="bg-yellow-100 dark:bg-yellow-900 neon-theme:bg-[#142a18] text-yellow-800 dark:text-yellow-200 neon-theme:text-[#39ff14] px-3 py-1 rounded-full text-xs font-medium border border-yellow-400 dark:border-yellow-600 neon-theme:border-[#39ff14]">🏆 Code Review</span>
                  <span className="bg-blue-100 dark:bg-blue-900 neon-theme:bg-[#142a18] text-blue-800 dark:text-blue-200 neon-theme:text-[#39ff14] px-3 py-1 rounded-full text-xs font-medium border border-blue-400 dark:border-blue-600 neon-theme:border-[#39ff14]">⚡ Bug Finder</span>
                  <span className="bg-purple-100 dark:bg-purple-900 neon-theme:bg-[#142a18] text-purple-800 dark:text-purple-200 neon-theme:text-[#39ff14] px-3 py-1 rounded-full text-xs font-medium border border-purple-400 dark:border-purple-600 neon-theme:border-[#39ff14]">✨ AI Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14] mb-4">🤖 Supported AI Models</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">Choose from multiple cutting-edge AI providers</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Gemini */}
          <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border-2 border-purple-300 dark:border-purple-600 neon-theme:border-[#39ff14] rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center">
            <img src="/assets/gemini.jpeg" alt="Gemini Logo" className="w-14 h-14 mb-3 rounded-full object-cover shadow" />
            <h4 className="font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14] text-center text-lg mb-2">Gemini</h4>
            <p className="text-xs text-green-600 dark:text-green-400 neon-theme:text-[#39ff14] font-semibold text-center">✓</p>
          </div>

          {/* ChatGPT */}
          <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border-2 border-green-300 dark:border-green-600 neon-theme:border-[#39ff14] rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center">
            <img src="/assets/chatgpt.jpeg" alt="ChatGPT Logo" className="w-14 h-14 mb-3 rounded-full object-cover shadow bg-white" />
            <h4 className="font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14] text-center text-lg mb-2">ChatGPT</h4>
            <p className="text-xs text-green-600 dark:text-green-400 neon-theme:text-[#39ff14] font-semibold text-center">✓</p>
          </div>

          {/* Perplexity */}
          <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border-2 border-blue-300 dark:border-blue-600 neon-theme:border-[#39ff14] rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center">
            <img src="/assets/perplexity.avif" alt="Perplexity Logo" className="w-14 h-14 mb-3 rounded-full object-cover shadow" />
            <h4 className="font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14] text-center text-lg mb-2">Perplexity</h4>
            <p className="text-xs text-green-600 dark:text-green-400 neon-theme:text-[#39ff14] font-semibold text-center">✓</p>
          </div>

          {/* Claude */}
          <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border-2 border-orange-300 dark:border-orange-600 neon-theme:border-[#39ff14] rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center">
            <img src="/assets/claude.png" alt="Claude Logo" className="w-14 h-14 mb-3 rounded-full object-cover shadow" />
            <h4 className="font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14] text-center text-lg mb-2">Claude</h4>
            <p className="text-xs text-green-600 dark:text-green-400 neon-theme:text-[#39ff14] font-semibold text-center">✓</p>
          </div>

          {/* Llama */}
          <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] border-2 border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center opacity-60">
            <img src="/assets/llama.jpeg" alt="Llama Logo" className="w-14 h-14 mb-3 rounded-full object-cover shadow" />
            <h4 className="font-bold text-gray-700 dark:text-gray-300 neon-theme:text-[#baffc9] text-center text-lg mb-2">Llama </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 neon-theme:text-[#baffc9] font-semibold text-center">Soon</p>
          </div>

          {/* More */}
          <div className="bg-gray-50 dark:bg-slate-800 neon-theme:bg-[#101d12] border-2 border-gray-200 dark:border-slate-600 neon-theme:border-[#404040] rounded-xl p-6 opacity-60 hover:opacity-75 transition-all duration-300 flex flex-col items-center">
            <div className="text-4xl mb-3 text-center">🎭</div>
            <h4 className="font-bold text-gray-700 dark:text-gray-300 neon-theme:text-[#baffc9] text-center text-lg mb-2">More</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 neon-theme:text-[#baffc9] font-semibold text-center">Soon</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="font-semibold text-gray-900 dark:text-white neon-theme:text-[#39ff14]">Luv AI</span>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300 neon-theme:text-[#baffc9]">
              <p>Powered by Multiple Agents</p>
              <p>Created by <span className="text-purple-600 dark:text-purple-400 neon-theme:text-[#39ff14] font-semibold">Luv Gupta</span></p>
            </div>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSave={(keys) => {
            console.log('API Keys saved:', keys);
            setShowSettings(false);
          }}
        />
      )}
      </div>
    </div>
  )
}

export default Hero