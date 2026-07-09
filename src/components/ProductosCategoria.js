'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ADMIN_KEY = 'gyc-admin'

export default function ProductosCategoria({ categoria, titulo, descripcion }) {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    const res = await fetch(`/api/productos?categoria=${categoria}`)
    setProductos(await res.json())
    setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
    setCargando(false)
  }

  useEffect(() => { cargar() }, [categoria])

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    cargar()
  }

  function whatsAppLink(p) {
    const url = typeof window !== 'undefined' ? window.location.origin : ''
    const msg = `Hola! Quiero comprar: ${p.nombre}%0a%0a${p.descripcion}%0a%0aM%C3%A1s info: ${url}/${categoria}/${p.id}`
    return `https://wa.me/3755213667?text=${msg}`
  }

  if (cargando) return <p className="vacio">Cargando...</p>

  return (
    <div>
      <div className="categoria-header">
        <h2>
          {titulo}
          {esAdmin && <span className="admin-badge">Admin</span>}
        </h2>
        {descripcion && <p className="categoria-desc">{descripcion}</p>}
        {esAdmin && (
          <Link href={`/productos/nuevo?categoria=${categoria}`} className="btn btn-verde" style={{ marginTop: '1rem', display: 'inline-block' }}>
            + Nuevo producto
          </Link>
        )}
      </div>

      {productos.length === 0 ? (
        <div className="vacio">
          <p>No hay productos en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="categoria-grid">
          {productos.map(p => (
            <div className="producto-card" key={p.id}>
              {p.imagen && <img src={p.imagen} alt={p.nombre} />}
              <div className="producto-card-body">
                <h3>{p.nombre}</h3>
                <p className="categoria-desc-corta">{p.descripcion}</p>
                {esAdmin && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <p><strong>Precio:</strong> ${Number(p.precio).toLocaleString('es-AR')}</p>
                    <p><strong>Stock:</strong> {p.stock} unidades</p>
                  </div>
                )}
              </div>
              <div className="producto-card-acciones">
                <a href={whatsAppLink(p)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Consultar por WhatsApp
                </a>
                {esAdmin && (
                  <>
                    <Link href={`/productos/${p.id}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
                    <button className="btn btn-rojo btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
