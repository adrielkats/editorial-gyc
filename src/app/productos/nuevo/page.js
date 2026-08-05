'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

function NuevoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoria = searchParams.get('categoria') || 'muebles'
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.admin) router.replace('/')
        else setAutorizado(true)
      })
      .catch(() => router.replace('/'))
  }, [router])

  async function crearProducto(datos) {
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
