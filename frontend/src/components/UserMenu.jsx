import React, { useState, useEffect, useRef } from 'react'

function UserMenu({ user, onSettings, onLogout, lightNameBg }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
          bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d]
          hover:bg-blue-50 hover:text-blue-700
          dark:hover:bg-slate-700 dark:hover:text-white
          neon-theme:hover:bg-[#142a18] neon-theme:hover:text-[#39ff14]
        `}
        title={user.name}
      >
        <div
          className={`w-9 h-9 flex items-center justify-center font-semibold text-base rounded-full border transition-all duration-300
            bg-white text-blue-700 border-blue-400
            dark:bg-blue-800 dark:text-white dark:border-blue-700
            neon-theme:bg-[#101d12] neon-theme:text-[#39ff14] neon-theme:border-[#39ff14]
            group-hover:text-blue-700 dark:group-hover:text-white neon-theme:group-hover:text-[#39ff14]
            shadow-sm`}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span
          className={`text-sm font-medium hidden md:block transition-colors px-2 py-1 rounded-lg ml-1
            bg-white text-gray-900 border border-gray-200 shadow-sm
            dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700
            neon-theme:bg-[#1a2f1d] neon-theme:text-[#baffc9] neon-theme:border-[#39ff14]
            group-hover:text-blue-700 dark:group-hover:text-white neon-theme:group-hover:text-[#39ff14]`
          }
        >
          {user.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-700 dark:text-gray-300 neon-theme:text-[#baffc9] transition-transform ${showMenu ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] z-50 py-1">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14]">
            <p className="text-sm font-semibold text-gray-900 dark:text-white neon-theme:text-[#39ff14]">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 neon-theme:text-[#baffc9]">
              {user.email}
            </p>
          </div>
          
          <button
            onClick={() => {
              onSettings()
              setShowMenu(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-gray-200 neon-theme:text-[#baffc9] transition flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18] hover:text-blue-900 dark:hover:text-white neon-theme:hover:text-[#39ff14]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <button
            onClick={() => {
              onLogout()
              setShowMenu(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-700 dark:text-red-400 neon-theme:text-[#ff4444] transition flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 neon-theme:hover:bg-[#2a1a1a] hover:text-red-900 dark:hover:text-red-300 neon-theme:hover:text-[#ff6b6b]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
