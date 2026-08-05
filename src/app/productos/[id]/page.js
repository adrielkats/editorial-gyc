import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminControls from './AdminControls'

const ETIQUETAS = { muebles: 'Muebles', espejos: 'Espejos', libros: 'Libros' }

function imgUrl(imagen, width = 800) {
  if (!imagen) return ''
  if (imagen.includes('res.cloudinary.com')) {
    return imagen.replace('/image/upload/', `/image/upload/w_${width},f_auto,q_80/`)
  }
  return imagen
}

export async function generateStaticParams() {
  const productos = await prisma.producto.findMany({ where: { visible: true }, select: { id: true } })
  return productos.map(p => ({ id: String(p.id) }))
}

export default async function DetalleProductoPage({ params }) {
  const { id } = await params
  const numId = Number(id)

  const producto = await prisma.producto.findUnique({ where: { id: numId } })

  if (!producto || !producto.visible) {
    return (
      <div className="vacio">
        <p>Producto no encontrado.</p>
        <Link href="/muebles" className="btn btn-gris">Volver a Muebles</Link>
      </div>
    )
  }

  const relacionados = await prisma.producto.findMany({
    where: { visible: true, categoria: producto.categoria, id: { not: numId } },
    take: 4,
    orderBy: { id: 'asc' },
  })

  const cat = producto.categoria || 'muebles'
  const etiqueta = ETIQUETAS[cat] || cat
  const precio = Number(producto.precio)
  const stock = Number(producto.stock)
  const urlProducto = `https://mueblegyc.vercel.app/productos/${producto.id}`
  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero comprar: ${producto.nombre}\n\n${producto.descripcion}\n\nMás info: ${urlProducto}`
  )

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

          <a
            href={`https://wa.me/3755213667?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-detalle"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>
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
