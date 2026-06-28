'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import datosIniciales from '../../../../../data/productos.json'

const STORAGE_KEY = 'gyc-productos'
const ADMIN_KEY = 'gyc-admin'

function obtenerProductos() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado ? JSON.parse(guardado) : datosIniciales
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

export default function EditarProductoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState(null)
  const [autorizado, setAutorizado] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const admin = localStorage.getItem(ADMIN_KEY) === 'true'
    if (!admin) {
      router.replace('/productos')
      return
    }
    setAutorizado(true)
    const productos = obtenerProductos()
    const encontrado = productos.find(p => p.id === Number(id))
    setProducto(encontrado || null)
    setCargando(false)
  }, [id, router])

  function actualizarProducto(datos) {
    const productos = obtenerProductos()
    const index = productos.findIndex(p => p.id === Number(id))
    if (index === -1) return
    productos[index] = { ...productos[index], ...datos }
    guardarProductos(productos)
    router.push(`/productos/${id}`)
  }

  if (!autorizado || cargando) return null

  if (!producto) {
    return (
      <div className="vacio">
        <p>Producto no encontrado.</p>
      </div>
    )
  }

  return (
    <ProductForm
      productoInicial={producto}
      onSubmit={actualizarProducto}
      titulo={`Editar: ${producto.nombre}`}
    />
  )
}
