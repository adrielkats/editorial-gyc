'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ADMIN_KEY = 'gyc-admin'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargando, setCargando] = useState(true)

  async function cargarProductos() {
    const res = await fetch('/api/productos')
    const data = await res.json()
    setProductos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarProductos()
    setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
  }, [])

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    cargarProductos()
  }

  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-AR')
  }

  function enlaceWhatsApp(producto) {
    const url = typeof window !== 'undefined' ? window.location.origin : ''
    const mensaje = `Hola! Quiero comprar: ${producto.nombre} - $${Number(producto.precio).toLocaleString('es-AR')}%0a%0aM%C3%A1s info: ${url}/productos/${producto.id}`
    return `https://wa.me/3755213667?text=${mensaje}`
  }

  if (cargando) return <p className="vacio">Cargando...</p>

  return (
    <div>
      <div className="productos-header">
        <h2>
          Productos ({productos.length})
          {esAdmin && <span className="admin-badge">Admin</span>}
        </h2>
        {esAdmin && (
          <Link href="/productos/nuevo" className="btn btn-verde">
            + Nuevo producto
          </Link>
        )}
      </div>

      {productos.length === 0 ? (
        <div className="vacio">
          <p>No hay productos todavía.</p>
          {esAdmin && (
            <Link href="/productos/nuevo" className="btn btn-azul">
              Agregar el primero
            </Link>
          )}
        </div>
      ) : esAdmin ? (
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
                <td><strong>{p.nombre}</strong></td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>
                  <span style={{ color: p.stock > 5 ? '#27ae60' : p.stock > 0 ? '#e67e22' : '#e74c3c', fontWeight: 600 }}>
                    {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                  </span>
                </td>
                <td>
                  <div className="acciones">
                    <Link href={`/productos/${p.id}`} className="btn btn-azul btn-sm">Ver</Link>
                    <Link href={`/productos/${p.id}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
                    <button className="btn btn-rojo btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="productos-grid">
          {productos.map(p => (
            <div className="producto-card" key={p.id}>
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <div className="producto-card-body">
                <h3>{p.nombre}</h3>
                <p className="precio">{formatearPrecio(p.precio)}</p>
                <p className="stock">
                  Stock: {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>
                  {p.descripcion.length > 80
                    ? p.descripcion.substring(0, 80) + '...'
                    : p.descripcion}
                </p>
              </div>
              <div className="producto-card-acciones">
                <Link href={`/productos/${p.id}`} className="btn btn-azul btn-sm">Ver m&aacute;s</Link>
                <a href={enlaceWhatsApp(p)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-whatsapp-sm">
                  Comprar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
