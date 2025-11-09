import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Login from '../components/Login'
import Signup from '../components/Signup'

function Landing({ user, setUser, setAuthToken, onLogout }) {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (userData, token) => {
    setUser(userData)
    setAuthToken(token)
    navigate('/chatbot')
  }

  const handleSignup = (userData, token) => {
    setUser(userData)
    setAuthToken(token)
    navigate('/chatbot')
  }

  const handleGetStarted = () => {
    if (user) {
      navigate('/chatbot')
    } else {
      setShowLogin(true)
    }
  }

  const handleLogoutLocal = () => {
    onLogout()
    setShowLogin(false)
    setShowSignup(false)
  }

  return (
    <div className="App">
      {showLogin ? (
        <Login onLogin={handleLogin} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />
      ) : showSignup ? (
        <Signup onSignup={handleSignup} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />
      ) : (
        <Hero 
          onGetStarted={handleGetStarted}
          user={user}
          authToken={setAuthToken}
          onLogout={handleLogoutLocal}
        />
      )}
    </div>
  )
}

export default Landing
