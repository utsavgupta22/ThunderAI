import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatPage from './Chat'
import { buildApiUrl } from '../utils/api'

function Chatbot({ user, authToken, onLogout }) {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [selectedBot, setSelectedBot] = useState('gemini')

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const handleNavigateHome = () => {
    navigate('/')
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
        const userData = data.user || data
        console.log('Updated user data:', userData)
        
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

  return (
    <ChatPage 
      user={user}
      authToken={authToken}
      onLogout={handleLogout}
      onNavigateHome={handleNavigateHome}
      onApiKeyUpdated={handleApiKeyUpdated}
    />
  )
}

export default Chatbot
