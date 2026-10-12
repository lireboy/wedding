import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from '@primereact/core'
import Aura from '@primeuix/themes/aura'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './theme.css'

import App from './App.tsx'

const primeReactConfig = {
  theme: {
    preset: Aura,
  },
  license: import.meta.env.VITE_PRIMEUI_LICENSE_KEY,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider {...primeReactConfig}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
