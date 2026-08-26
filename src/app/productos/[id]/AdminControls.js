'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SalirAdmin from '@/components/SalirAdmin'

export default function AdminControls({ productoId }) {
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setEsAdmin(d.admin))
      .catch(() => setEsAdmin(false))
  }, [])

  if (!esAdmin) return null

  return (
    <>
      <span className="admin-badge">Admin</span>
      <Link href={`/productos/${productoId}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
      <SalirAdmin />
    </>
  )
}
