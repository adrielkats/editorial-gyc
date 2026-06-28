'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import datosIniciales from '../../../data/productos.json'

const STORAGE_KEY = 'gyc-productos'
const ADMIN_KEY = 'gyc-admin'

function cargarProductos() {
  if (typeof window === 'undefined') return []
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) return JSON.parse(guardado)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datosIniciales))
  return datosIniciales
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

function enlaceWhatsApp(producto) {
  const url = typeof window !== 'undefined' ? window.location.origin : ''
  const mensaje = `Hola! Quiero comprar: ${producto.nombre} - $${Number(producto.precio).toLocaleString('es-AR')}%0a%0aMás info: ${url}/productos/${producto.id}`
  return `https://wa.me/3755213667?text=${mensaje}`
}

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setProductos(cargarProductos())
    setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
    setCargando(false)
  }, [])

  function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    const nuevos = productos.filter(p => p.id !== id)
    setProductos(nuevos)
    guardarProductos(nuevos)
  }

  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-AR')
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
        /* VISTA ADMIN: tabla con CRUD */
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
        /* VISTA COMPRADOR: tarjetas con WhatsApp */
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
                <Link href={`/productos/${p.id}`} className="btn btn-azul btn-sm">Ver más</Link>
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
