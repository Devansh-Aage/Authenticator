import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { SolanaProvider } from './SolanaProvider.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </BrowserRouter>
  </StrictMode>,
)
