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
      if (res.ok) {
        setProducto(await res.json())
      }
      setEsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
      setCargando(false)
    }
    cargar()
  }, [id])

  function formatearPrecio(precio) {
    return '$' + Number(precio).toLocaleString('es-AR')
  }

  function enlaceWhatsApp() {
    if (!producto) return '#'
    const mensaje = `Hola! Quiero comprar: ${producto.nombre} - ${formatearPrecio(producto.precio)}%0a%0a${producto.descripcion}`
    return `https://wa.me/3755213667?text=${mensaje}`
  }

  if (cargando) return <p className="vacio">Cargando...</p>

  if (!producto) {
    return (
      <div className="vacio">
        <p>Producto no encontrado.</p>
        <Link href="/productos" className="btn btn-azul">Volver a productos</Link>
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
        <p className="precio">{formatearPrecio(producto.precio)}</p>
        <p className="stock">
          Stock:{' '}
          <span style={{ color: producto.stock > 5 ? '#27ae60' : producto.stock > 0 ? '#e67e22' : '#e74c3c', fontWeight: 600 }}>
            {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
          </span>
        </p>
        <p className="descripcion">{producto.descripcion}</p>
        <div className="detalle-acciones">
          <a href={enlaceWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            Comprar por WhatsApp
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
