import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"; 
import MainLayout from './components/MainLayout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

// 1. IMPORT YOUR AUTH PROVIDER HERE
// (Double-check the path to where your AuthProvider is exported)
import { AuthProvider } from './hooks/useAuth' 

export default function App() {
  return (
    // 2. WRAP EVERYTHING INSIDE THE PROVIDER
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth (no sidebar) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Main app with sidebar layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}