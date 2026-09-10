import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// apply saved theme/density/lang before React mounts to avoid flash
try {
  const th = (localStorage.getItem("fh_theme") as string) || "system";
  const resolved = th === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : th;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-density", localStorage.getItem("fh_density") || "comfortable");
  const lang = localStorage.getItem("fh_lang") || "en";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
