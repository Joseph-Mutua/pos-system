import React from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import POSApp from './components/POSApp'

const root = document.querySelector<HTMLDivElement>('#app')!
createRoot(root).render(
  <React.StrictMode>
    <POSApp />
  </React.StrictMode>
)
