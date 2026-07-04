import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Add global error handlers for better debugging in production
window.addEventListener('unhandledrejection', (event) => {
  console.error('[global] Unhandled promise rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('[global] Uncaught error:', event.error);
});
