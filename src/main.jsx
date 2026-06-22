import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode removed — it double-fires useEffect which breaks
// the Supabase auth listener and causes infinite loading in dev.
createRoot(document.getElementById('root')).render(
  <App />
)