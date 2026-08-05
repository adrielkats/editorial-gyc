'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const ruta = usePathname()
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setEsAdmin(d.admin))
      .catch(() => setEsAdmin(false))
  }, [])

  async function cerrarSesion() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setEsAdmin(false)
    window.location.reload()
  }

  function activa(path) {
    return ruta.startsWith(path) ? 'active' : ''
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <span>MuebleG&amp;C</span>
        </Link>
        <nav className="header-nav" aria-label="Secciones">
          <Link href="/" className={ruta === '/' ? 'active' : ''}>Inicio</Link>
          <Link href="/muebles" className={activa('/muebles')}>Muebles</Link>
          <Link href="/espejos" className={activa('/espejos')}>Espejos</Link>
          <Link href="/libros" className={activa('/libros')}>Libros</Link>
          {esAdmin ? (
            <button className="btn-admin" onClick={cerrarSesion}>Salir</button>
          ) : (
            <Link href="/admin/login" className="btn-admin" title="Acceso administrador">Admin</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
