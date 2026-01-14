// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import VerificationCode from './pages/VerificationCode';
import ChangePassword from './pages/ChangePassword';
import AssignRoles from './pages/AssignRoles';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import ManageServices from './pages/ManageServices';
import Reports from './pages/Reports';
import Gallery from './pages/Gallery';
import Information from './pages/Information';
import ManageBarbers from './pages/ManageBarbers';
import BarberAppointments from './pages/BarberAppointments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - authentication related */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/verification-code" element={<ProtectedRoute><VerificationCode /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
        <Route path="/information" element={<ProtectedRoute><Information /></ProtectedRoute>} />
        <Route path="/manage-barbers" element={<ProtectedRoute><ManageBarbers /></ProtectedRoute>} />
        <Route path="/barber-appointments" element={<ProtectedRoute><BarberAppointments /></ProtectedRoute>} />

        {/* Protected routes */}
        <Route path="/assign-roles" element={
          <ProtectedRoute>
            <AssignRoles />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment" element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />      
        <Route path="/manage-services" element={
          <ProtectedRoute>
            <ManageServices />
          </ProtectedRoute>
        } />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute requiredPermission="view_reports">
              <Reports />
            </ProtectedRoute>
          } 
        />
        {/* Redirect root to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;