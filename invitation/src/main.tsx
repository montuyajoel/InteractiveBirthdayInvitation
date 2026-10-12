import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTheme } from './theme'
import { COPY } from './config'
import { plainTitle } from './lib/event'

// Colours and fonts come from src/theme.ts. Fonts load at runtime so the
// single-file bundle doesn't try to inline them.
applyTheme()
document.title = plainTitle(COPY.pageTitle)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
