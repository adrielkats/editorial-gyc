'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

const ADMIN_KEY = 'gyc-admin'

export default function NuevoProductoPage() {
  const router = useRouter()
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY) !== 'true') {
      router.replace('/productos')
    } else {
      setAutorizado(true)
    }
  }, [router])

  async function crearProducto(datos) {
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    router.push('/productos')
  }

  if (!autorizado) return null

  return <ProductForm onSubmit={crearProducto} titulo="Nuevo producto" />
}
