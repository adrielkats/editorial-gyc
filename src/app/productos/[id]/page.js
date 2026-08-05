import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminControls from './AdminControls'
import WhatsAppButton from '@/components/WhatsAppButton'

const ETIQUETAS = { muebles: 'Muebles', espejos: 'Espejos', libros: 'Libros' }

function imgUrl(imagen, width = 800) {
  if (!imagen) return ''
  if (imagen.includes('res.cloudinary.com')) {
    return imagen.replace('/image/upload/', `/image/upload/w_${width},f_auto,q_80/`)
  }
  return imagen
}

export async function generateStaticParams() {
  try {
    const productos = await prisma.producto.findMany({ where: { visible: true }, select: { id: true } })
    return productos.map(p => ({ id: String(p.id) }))
  } catch {
    return []
  }
}

export default async function DetalleProductoPage({ params }) {
  const { id } = await params
  const numId = Number(id)

  let producto = null
  let relacionados = []
  try {
    producto = await prisma.producto.findUnique({ where: { id: numId } })
    if (producto?.visible) {
      relacionados = await prisma.producto.findMany({
        where: { visible: true, categoria: producto.categoria, id: { not: numId } },
        take: 4,
        orderBy: { id: 'asc' },
      })
    } else {
      producto = null
    }
  } catch {
    producto = null
  }

  if (!producto) {
    return (
      <div className="vacio">
        <p>Producto no encontrado.</p>
        <Link href="/muebles" className="btn btn-gris">Volver a Muebles</Link>
      </div>
    )
  }

  const cat = producto.categoria || 'muebles'
  const etiqueta = ETIQUETAS[cat] || cat
  const precio = Number(producto.precio)
  const stock = Number(producto.stock)

  return (
    <div className="detalle-page">
      <nav className="breadcrumb" aria-label="Ubicación">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${cat}`}>{etiqueta}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="detalle-layout">
        <div className="detalle-imagen">
          {producto.imagen && (
            <img src={imgUrl(producto.imagen)} alt={producto.nombre} />
          )}
        </div>

        <div className="detalle-info">
          <span className="categoria-badge">{etiqueta}</span>

          <div className="detalle-titulo-row">
            <h1>{producto.nombre}</h1>
            <AdminControls productoId={numId} />
          </div>

          {precio > 0 && (
            <p className="detalle-precio">${precio.toLocaleString('es-AR')}</p>
          )}

          {stock > 0 ? (
            <span className="stock-badge stock-ok">Disponible</span>
          ) : (
            <span className="stock-badge stock-consultar">Consultar disponibilidad</span>
          )}

          <p className="detalle-descripcion">{producto.descripcion}</p>

          <div className="detalle-envio">
            <ul>
              <li>
                <svg className="envio-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Envíos a Misiones, Corrientes y todo el país
              </li>
              <li>
                <svg className="envio-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Coordiná la entrega por WhatsApp
              </li>
              <li>
                <svg className="envio-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                Fabricación artesanal
              </li>
            </ul>
          </div>

          <WhatsAppButton producto={producto} />
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="relacionados">
          <h2>También te puede interesar</h2>
          <div className="relacionados-grid">
            {relacionados.map(p => (
              <Link href={`/productos/${p.id}`} className="producto-card" key={p.id}>
                {p.imagen && (
                  <img src={imgUrl(p.imagen, 400)} alt={p.nombre} className="producto-card-img" loading="lazy" />
                )}
                <div className="producto-card-body">
                  <h3>{p.nombre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
