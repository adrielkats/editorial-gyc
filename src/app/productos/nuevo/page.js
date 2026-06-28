'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import datosIniciales from '../../../../data/productos.json'

const STORAGE_KEY = 'gyc-productos'
const ADMIN_KEY = 'gyc-admin'

function obtenerProductos() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado ? JSON.parse(guardado) : datosIniciales
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [autorizado, setAutorizado] = useState(null)

  useEffect(() => {
    const admin = localStorage.getItem(ADMIN_KEY) === 'true'
    if (!admin) {
      router.replace('/productos')
    } else {
      setAutorizado(true)
    }
  }, [router])

  function crearProducto(datos) {
    const productos = obtenerProductos()
    const maxId = productos.reduce((max, p) => Math.max(max, p.id), 0)
    const nuevo = { id: maxId + 1, ...datos }
    productos.push(nuevo)
    guardarProductos(productos)
    router.push('/productos')
  }

  if (!autorizado) return null

  return (
    <ProductForm
      onSubmit={crearProducto}
      titulo="Nuevo producto"
    />
  )
}
