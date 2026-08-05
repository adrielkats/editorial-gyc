'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminControls({ productoId }) {
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    setEsAdmin(!!localStorage.getItem('gyc-admin'))
  }, [])

  if (!esAdmin) return null

  return (
    <>
      <span className="admin-badge">Admin</span>
      <Link href={`/productos/${productoId}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
    </>
  )
}
