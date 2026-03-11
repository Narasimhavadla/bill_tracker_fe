import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import PharmaLogin from './pages/login'
// import InternalDashboard from './admin/internalDashboard'
import ExternalDashboard from './admin/externalDashboard'
import AdminLayout from './admin/AdminLayout'
import EmpDashboard from './employee/empDashboard'
import AdminBilling from './admin/AdminBilling'
import AdminPicking from './admin/AdminPicking'
import Verifying from './admin/AdminVerifying'
import { AuthProvider } from './Context/AuthContext'
import ProtectedRoute from './Context/protectdRoute'

function App() {
  const [count, setCount] = useState(0)



  return (
    <div>
      <Routes>
        <Route path="/" element={ <PharmaLogin />}></Route>
        <Route path="/internal-dashboard" element={ <AdminLayout />}></Route>
        <Route path="/external-dashboard" element={ <ExternalDashboard />}></Route>
        <Route path="/emp-dashboard" element={ <EmpDashboard />}></Route>
      </Routes>

      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          
          {/* Protected Billing Route */}
          <Route path="/billing" element={
            <ProtectedRoute permission="canBill">
              <AdminBilling />
            </ProtectedRoute>
          } />

          {/* Protected Picking Route */}
          <Route path="/picking" element={
            <ProtectedRoute permission="canPick">
              <AdminPicking />
            </ProtectedRoute>
          } />

          <Route path="/verifying" element={
            <ProtectedRoute permission="canPick">
              <Verifying />
            </ProtectedRoute>
          } />

          {/* Denied Page */}
          {/* <Route path="/access-denied" element={<AccessDenied />} /> */}
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
