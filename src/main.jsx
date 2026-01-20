import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MarketplaceProvider } from "./contexts/MarketplaceContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketplaceProvider>
      <App />
    </MarketplaceProvider>

  </StrictMode>,
)
