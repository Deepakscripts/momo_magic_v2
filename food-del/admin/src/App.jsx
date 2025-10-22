// food-del/admin/src/App.jsx
import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Analytics from './pages/Analytics/Analytics'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar onHamburgerClick={() => setSidebarOpen(s => !s)} />
      <hr />
      <div className="app-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/analytics" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
