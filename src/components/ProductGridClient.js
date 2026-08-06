'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProductGridClient({ productos: productosIniciales, categoria }) {
  const router = useRouter()
  const [productos, setProductos] = useState(productosIniciales)
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setEsAdmin(d.admin))
      .catch(() => setEsAdmin(false))
  }, [])

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProductos(prev => prev.filter(p => p.id !== id))
    }
  }

  function imgUrl(p) {
    if (!p.imagen) return ''
    if (p.imagen.includes('res.cloudinary.com')) {
      return p.imagen.replace('/image/upload/', '/image/upload/w_400,f_auto,q_80/')
    }
    return p.imagen
  }

  return (
    <div>
      <div className="categoria-header">
        <h2>
          {categoria === 'muebles' ? 'Muebles' : categoria === 'espejos' ? 'Espejos' : 'Libros'}
          {esAdmin && <span className="admin-badge">Admin</span>}
        </h2>
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
