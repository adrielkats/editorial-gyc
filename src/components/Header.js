'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ADMIN_KEY = 'gyc-admin'
const ADMIN_PASS = 'admin123'

export default function Header() {
  const ruta = usePathname()
  const [esAdmin, setEsAdmin] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [pass, setPass] = useState('')

  useEffect(() => {
    setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
  }, [])

  function iniciarSesion() {
    if (pass === ADMIN_PASS) {
      localStorage.setItem(ADMIN_KEY, 'true')
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
      <div className="header-logo">
        <span>📚 Editorial G&amp;C</span>
      </div>
      <nav className="header-nav">
        <Link href="/" className={activa('/') === 'active' && ruta === '/' ? 'active' : ''}>
          Inicio
        </Link>
        <Link href="/productos" className={activa('/productos')}>
          Productos
        </Link>
        {esAdmin ? (
          <button className="btn-admin" onClick={cerrarSesion}>
            Salir admin
          </button>
        ) : (
          <button className="btn-admin" onClick={() => setMostrarLogin(true)}>
            Admin
          </button>
        )}
      </nav>

      {mostrarLogin && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Acceso administrador</h3>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Contraseña"
              onKeyDown={e => e.key === 'Enter' && iniciarSesion()}
              autoFocus
            />
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
