'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import datosIniciales from '../../../data/productos.json'

const STORAGE_KEY = 'gyc-productos'

function cargarProductos() {
  if (typeof window === 'undefined') return []
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) {
    return JSON.parse(guardado)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales))
  return datosIniciales
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setProductos(cargarProductos())
    setCargando(false)
  }, [])

  function eliminar(id) {
    const confirmar = window.confirm('¿Estás seguro de eliminar este producto?')
    if (!confirmar) return

    const nuevos = productos.filter(p => p.id !== id)
    setProductos(nuevos)
    guardarProductos(nuevos)
  }

  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-AR')
  }

  if (cargando) return <p>Cargando...</p>

  if (productos.length === 0) {
    return (
      <div>
        <div className="productos-header">
          <h2>Productos</h2>
          <Link href="/productos/nuevo" className="btn btn-verde">
            + Nuevo producto
          </Link>
        </div>
        <div className="vacio">
          <p>No hay productos todavía.</p>
          <Link href="/productos/nuevo" className="btn btn-azul">
            Agregar el primero
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="productos-header">
        <h2>Productos ({productos.length})</h2>
        <Link href="/productos/nuevo" className="btn btn-verde">
          + Nuevo producto
        </Link>
      </div>

      {/* Vista en tabla */}
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>
                <strong>{p.nombre}</strong>
              </td>
              <td>{formatearPrecio(p.precio)}</td>
              <td>
                <span style={{
                  color: p.stock > 5 ? '#27ae60' : p.stock > 0 ? '#e67e22' : '#e74c3c',
                  fontWeight: 600
                }}>
                  {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                </span>
              </td>
              <td>
                <div className="acciones">
                  <Link href={`/productos/${p.id}`} className="btn btn-azul btn-sm">
                    Ver
                  </Link>
                  <Link href={`/productos/${p.id}/editar`} className="btn btn-naranja btn-sm">
                    Editar
                  </Link>
                  <button className="btn btn-rojo btn-sm" onClick={() => eliminar(p.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
