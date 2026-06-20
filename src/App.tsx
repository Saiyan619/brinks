import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './auth/register/Register'
import Login from './auth/login/Login'
import VerifyEmail from './auth/verifyEmail/VerifyEmail'
import ProtectedRoutes from './ProtectedRoutes'
import DashboardLayout from './layouts/DashboardLayout'
import Search from './search/Search'

function App() {
  return (
    <>
      <Routes>
        {/* Public auth routes - no sidebar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected routes with sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoutes>
              <DashboardLayout />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  )
}

export default App
