import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';

import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminUsers       from './pages/admin/AdminUsers';
import AdminUserDetail  from './pages/admin/AdminUserDetail';
import AdminAddUser     from './pages/admin/AdminAddUser';
import AdminStores      from './pages/admin/AdminStores';
import AdminAddStore    from './pages/admin/AdminAddStore';

import UserStores from './pages/user/UserStores';

import OwnerDashboard from './pages/owner/OwnerDashboard';

import UpdatePassword from './pages/shared/UpdatePassword';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* System Administrator */}
        <Route path="/admin" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/users/add" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminAddUser /></ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminUserDetail /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminStores /></ProtectedRoute>
        } />
        <Route path="/admin/stores/add" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><AdminAddStore /></ProtectedRoute>
        } />
        <Route path="/admin/update-password" element={
          <ProtectedRoute role="SYSTEM_ADMIN"><UpdatePassword /></ProtectedRoute>
        } />

        {/* Normal User */}
        <Route path="/user/stores" element={
          <ProtectedRoute role="NORMAL_USER"><UserStores /></ProtectedRoute>
        } />
        <Route path="/user/update-password" element={
          <ProtectedRoute role="NORMAL_USER"><UpdatePassword /></ProtectedRoute>
        } />

        {/* Store Owner */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute role="STORE_OWNER"><OwnerDashboard /></ProtectedRoute>
        } />
        <Route path="/owner/update-password" element={
          <ProtectedRoute role="STORE_OWNER"><UpdatePassword /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
