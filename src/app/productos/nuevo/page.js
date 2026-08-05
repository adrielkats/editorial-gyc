'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

const ADMIN_KEY = 'gyc-admin'

function NuevoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoria = searchParams.get('categoria') || 'muebles'
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem(ADMIN_KEY)) {
      router.replace('/')
    } else {
      setAutorizado(true)
    }
  }, [router])

  async function crearProducto(datos) {
    const clave = localStorage.getItem(ADMIN_KEY) || ''
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': clave },
      body: JSON.stringify(datos),
    })
    router.push(`/${datos.categoria}`)
  }

  if (!autorizado) return null

  return <ProductForm productoInicial={{ categoria }} onSubmit={crearProducto} titulo="Nuevo producto" />
}

export default function NuevoProductoPage() {
  return (
    <Suspense>
      <NuevoForm />
    </Suspense>
  )
}
