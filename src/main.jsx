import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// Start the home page at its hero instead of restoring a previous scroll offset.
if (window.location.pathname === '/' && !window.location.hash) {
  window.history.scrollRestoration = 'manual'
  const resetHomeScroll = () => {
    if (window.location.pathname === '/' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }
  resetHomeScroll()
  window.addEventListener('pageshow', resetHomeScroll)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
