'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

export default function EditarProductoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState(null)
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.admin) { router.replace('/'); return }
        setAutorizado(true)
        fetch(`/api/productos/${id}`)
          .then(r => r.ok ? r.json() : null)
          .then(setProducto)
      })
      .catch(() => router.replace('/'))
  }, [id, router])

  async function actualizarProducto(datos) {
    await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    router.push(`/${datos.categoria}`)
  }

  if (!autorizado || !producto) return null

  return (
    <ProductForm
      productoInicial={producto}
      onSubmit={actualizarProducto}
      titulo={`Editar: ${producto.nombre}`}
    />
  )
}
