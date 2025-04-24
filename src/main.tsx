
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Wrapping ici */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
