import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import FarmerDashboard from './pages/FarmerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
      <Route path="/worker" element={<WorkerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App