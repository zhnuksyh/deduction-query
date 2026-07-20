import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Trailer from './Trailer.jsx'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Trailer />
  </StrictMode>,
)
