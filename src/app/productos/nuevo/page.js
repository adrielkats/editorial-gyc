'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import datosIniciales from '../../../../data/productos.json'

const STORAGE_KEY = 'gyc-productos'

function obtenerProductos() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado ? JSON.parse(guardado) : datosIniciales
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

export default function NuevoProductoPage() {
  const router = useRouter()

  function crearProducto(datos) {
    const productos = obtenerProductos()
    const maxId = productos.reduce((max, p) => Math.max(max, p.id), 0)
    const nuevo = { id: maxId + 1, ...datos }
    productos.push(nuevo)
    guardarProductos(productos)
    router.push('/productos')
  }

  return (
    <ProductForm
      onSubmit={crearProducto}
      titulo="Nuevo producto"
    />
  )
}
