'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ADMIN_KEY = 'gyc-admin'
const ADMIN_PASS = 'Adriel2018'

export default function Header() {
  const ruta = usePathname()
  const [esAdmin, setEsAdmin] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [pass, setPass] = useState('')
  const logoClicks = useRef(0)
  const logoTimer = useRef(null)

  useEffect(() => {
    setEsAdmin(!!localStorage.getItem(ADMIN_KEY))
  }, [])

  useEffect(() => {
    if (!mostrarLogin) return
    const cerrar = e => { if (e.key === 'Escape') { setMostrarLogin(false); setPass('') } }
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [mostrarLogin])

  function tocarLogo() {
    logoClicks.current += 1
    clearTimeout(logoTimer.current)
    logoTimer.current = setTimeout(() => { logoClicks.current = 0 }, 1500)
    if (logoClicks.current >= 5) {
      logoClicks.current = 0
      setMostrarLogin(true)
    }
  }

  function iniciarSesion() {
    if (pass === ADMIN_PASS) {
      localStorage.setItem(ADMIN_KEY, pass)
      window.location.reload()
    } else {
      alert('Contraseña incorrecta')
    }
  }

  function cerrarSesion() {
    localStorage.removeItem(ADMIN_KEY)
    window.location.reload()
  }

  function activa(path) {
    return ruta.startsWith(path) ? 'active' : ''
  }

  return (
    <header className="header">
      <div className="header-inner">
        <button type="button" className="header-logo" onClick={tocarLogo} aria-label="MuebleG&C — Inicio">
          <span>MuebleG&amp;C</span>
        </button>
        <nav className="header-nav" aria-label="Secciones">
          <Link href="/" className={ruta === '/' ? 'active' : ''}>Inicio</Link>
          <Link href="/muebles" className={activa('/muebles')}>Muebles</Link>
          <Link href="/espejos" className={activa('/espejos')}>Espejos</Link>
          <Link href="/libros" className={activa('/libros')}>Libros</Link>
          {esAdmin && (
            <button className="btn-admin" onClick={cerrarSesion}>Salir</button>
          )}
        </nav>
      </div>

      {mostrarLogin && (
        <div
          className="admin-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Acceso administrador"
          onClick={e => { if (e.target === e.currentTarget) { setMostrarLogin(false); setPass('') } }}
        >
          <div className="admin-modal-content">
            <h3>Acceso administrador</h3>
            <label htmlFor="admin-pass" className="visually-hidden">Contraseña</label>
            <input id="admin-pass" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Contraseña" onKeyDown={e => e.key === 'Enter' && iniciarSesion()} autoFocus />
            <div className="admin-modal-acciones">
              <button className="btn btn-azul" onClick={iniciarSesion}>Entrar</button>
              <button className="btn btn-gris" onClick={() => { setMostrarLogin(false); setPass('') }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
