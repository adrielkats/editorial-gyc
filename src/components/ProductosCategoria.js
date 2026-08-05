'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ADMIN_KEY = 'gyc-admin'

export default function ProductosCategoria({ categoria, titulo, descripcion }) {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  async function cargar() {
    setCargando(true)
    setError(false)
    try {
      const res = await fetch(`/api/productos?categoria=${categoria}`)
      if (res.ok) setProductos(await res.json())
      else setError(true)
    } catch {
      setError(true)
    }
    setEsAdmin(!!localStorage.getItem(ADMIN_KEY))
    setCargando(false)
  }

  useEffect(() => { cargar() }, [categoria])

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    const clave = localStorage.getItem(ADMIN_KEY) || ''
    await fetch(`/api/productos/${id}`, { method: 'DELETE', headers: { 'x-admin-key': clave } })
    cargar()
  }

  function imgUrl(p) {
    if (!p.imagen) return ''
    if (p.imagen.includes('res.cloudinary.com')) {
      return p.imagen.replace('/image/upload/', '/image/upload/w_400,f_auto,q_80/')
    }
    return p.imagen
  }

  if (cargando) return <p className="vacio" role="status">Cargando...</p>

  if (error) {
    return (
      <div className="vacio">
        <p>No pudimos cargar los productos. Revisá tu conexión.</p>
        <button className="btn btn-azul" onClick={cargar}>Reintentar</button>
      </div>
    )
  }

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
          <p>Estamos cargando esta categoría. ¡Próximamente!</p>
          <a href="https://wa.me/3755213667?text=Hola!%20Quiero%20consultar%20por%20un%20producto." target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-whatsapp-sm">Consultar por WhatsApp</a>
        </div>
      ) : (
        <div className="categoria-grid">
          {productos.map(p => (
            <div className="producto-card" key={p.id}>
              <Link href={`/productos/${p.id}`}>
                {p.imagen && <img src={imgUrl(p)} alt={p.nombre} className="producto-card-img" loading="lazy" />}
                <div className="producto-card-body">
                  <h3>{p.nombre}</h3>
                </div>
              </Link>
              {esAdmin && (
                <div className="producto-card-acciones">
                  <Link href={`/productos/${p.id}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
                  <button className="btn btn-rojo btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
