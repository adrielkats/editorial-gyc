'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const ruta = usePathname()

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
      </nav>
    </header>
  )
}
