'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const ADMIN_KEY = 'gyc-admin'

export default function DetalleProductoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const res = await fetch(`/api/productos/${id}`)
      if (res.ok) setProducto(await res.json())
      setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
      setCargando(false)
    }
    cargar()
  }, [id])

  function enlaceWhatsApp() {
    if (!producto) return '#'
    const msg = `Hola! Quiero comprar: ${producto.nombre}%0a%0a${producto.descripcion}`
    return `https://wa.me/3755213667?text=${msg}`
  }

  if (cargando) return <p className="vacio">Cargando...</p>

  if (!producto) {
    return (
      <div className="vacio">
        <p>Producto no encontrado.</p>
        <Link href="/" className="btn btn-azul">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="detalle">
      {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
      <div className="detalle-body">
        <h2>
          {producto.nombre}
          {esAdmin && <span className="admin-badge">Admin</span>}
        </h2>
        <p className="descripcion" style={{ fontSize: '1.1rem', margin: '1rem 0', color: '#444' }}>{producto.descripcion}</p>

        {esAdmin && (
          <div style={{ background: '#f8f8ff', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <p><strong>Precio:</strong> ${Number(producto.precio).toLocaleString('es-AR')}</p>
            <p><strong>Stock:</strong> {producto.stock} unidades</p>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
          </div>
        )}

        <div className="detalle-acciones">
          <a href={enlaceWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            Consultar por WhatsApp
          </a>
          {esAdmin && (
            <Link href={`/productos/${producto.id}/editar`} className="btn btn-naranja">
              Editar
            </Link>
          )}
          <button className="btn btn-gris" onClick={() => router.back()}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
