
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from './components/MainLayout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { useSession } from './hooks/useSession'


export default function App() {
  const { session, loading } = useSession()


  return (

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
