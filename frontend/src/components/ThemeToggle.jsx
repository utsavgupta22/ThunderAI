import React, { useState, useEffect } from 'react'

function ThemeToggle() {
  const [theme, setTheme] = useState('system')
  const [showMenu, setShowMenu] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (selectedTheme) => {
    const html = document.documentElement
    const body = document.body
    let finalTheme = selectedTheme

    // If system theme, check system preference
    if (selectedTheme === 'system') {
      finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Remove existing theme classes from both html and body
    html.classList.remove('light-theme', 'dark-theme', 'neon-theme')
    body.classList.remove('light-theme', 'dark-theme', 'neon-theme')

    // Apply selected theme to html element
    if (finalTheme === 'dark') {
      html.classList.add('dark-theme')
    } else if (finalTheme === 'neon') {
      html.classList.add('neon-theme')
    } else {
      html.classList.add('light-theme')
    }

    // Force background and text color update
    if (finalTheme === 'dark') {
      body.style.backgroundColor = '#0f172a'
      body.style.color = '#f1f5f9'
    } else if (finalTheme === 'neon') {
      body.style.backgroundColor = '#0a150c'
      body.style.color = '#39ff14'
    } else {
      body.style.backgroundColor = '#f9fafb'
      body.style.color = '#111827'
    }

    localStorage.setItem('theme', selectedTheme)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    setShowMenu(false)
  }

  const themeIcons = {
    light: '☀️',
    dark: '🌙',
    neon: '🟢',
    system: '💻'
  }

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    neon: 'Neon',
    system: 'System'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18] transition flex items-center gap-1 hover:text-blue-700 dark:hover:text-white neon-theme:hover:text-[#39ff14]"
        title="Toggle theme"
      >
        <span className="text-lg">{themeIcons[theme]}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] z-50">
          {Object.entries(themeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition ${
                theme === key
                  ? 'bg-blue-100 dark:bg-blue-900 neon-theme:bg-[#142a18] text-blue-900 dark:text-blue-100 neon-theme:text-[#39ff14] font-semibold'
                  : 'hover:bg-blue-50 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18] text-gray-700 dark:text-gray-300 neon-theme:text-[#baffc9] hover:text-blue-900 dark:hover:text-white neon-theme:hover:text-[#39ff14]'
              }`}
            >
              <span className="text-lg">{themeIcons[key]}</span>
              <span>{label}</span>
              {theme === key && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeToggle
