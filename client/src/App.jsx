import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Auth from './components/Auth'
import WorkspacePage from './pages/WorkspacePage'
import DashboardPage from './pages/DashboardPage'
import { ToastProvider } from './components/ToastContext'

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App