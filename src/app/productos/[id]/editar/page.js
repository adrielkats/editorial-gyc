'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

const ADMIN_KEY = 'gyc-admin'

export default function EditarProductoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState(null)
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY) !== 'true') {
      router.replace('/')
      return
    }
    setAutorizado(true)
    async function cargar() {
      const res = await fetch(`/api/productos/${id}`)
      if (res.ok) setProducto(await res.json())
    }
    cargar()
  }, [id, router])

  async function actualizarProducto(datos) {
    await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    router.push(`/${datos.categoria}`)
  }

  if (!autorizado) return null
  if (!producto) return null

  return (
    <ProductForm
      productoInicial={producto}
      onSubmit={actualizarProducto}
      titulo={`Editar: ${producto.nombre}`}
    />
  )
}
