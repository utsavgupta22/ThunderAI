import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Chatbot from './pages/Chatbot'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '')
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setAuthToken(storedToken)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }
    }
    
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    setUser(null)
    setAuthToken('')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('gemini_api_key')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing user={user} setUser={setUser} setAuthToken={setAuthToken} onLogout={handleLogout} />} />
        <Route path="/chatbot" element={user && authToken ? <Chatbot user={user} authToken={authToken} onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App