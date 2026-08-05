import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const WHATSAPP = '3755213667'

function imgUrl(imagen) {
  if (!imagen) return ''
  if (imagen.includes('res.cloudinary.com')) {
    return imagen.replace('/image/upload/', '/image/upload/w_400,f_auto,q_80/')
  }
  return imagen
}

export default async function Home() {
  const destacados = await prisma.producto.findMany({
    where: { visible: true, categoria: 'muebles' },
    orderBy: { id: 'asc' },
    take: 5,
  })

  return (
    <div>
      <div className="hero-wrapper">
        <div className="flag-bg">
          <div className="flag-stripe flag-blue" />
          <div className="flag-stripe flag-white" />
          <div className="flag-stripe flag-blue" />
        </div>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-titulo">MuebleG&amp;C</h1>
            <p className="hero-slogan">Calidad y diseño para tu hogar</p>
            <Link href="/muebles" className="hero-btn">Ver catálogo</Link>
          </div>
        </section>
        <div className="hero-logo-col">
          <img src="/LogoGyCArg.png" alt="Logo MuebleG&C Argentina" />
        </div>
      </div>

      {destacados.length > 0 && (
        <section className="destacados">
          <div className="destacados-head">
            <h2>Productos destacados</h2>
            <Link href="/muebles" className="destacados-ver-todos">Ver todos &rarr;</Link>
          </div>
          <div className="destacados-grid">
            {destacados.map(p => (
              <Link href={`/productos/${p.id}`} className="producto-card" key={p.id}>
                {p.imagen && <img src={imgUrl(p.imagen)} alt={p.nombre} className="producto-card-img" loading="lazy" />}
                <div className="producto-card-body">
                  <h3>{p.nombre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="about">
        <div className="about-inner">
          <h2>Sobre nosotros</h2>
          <p>
            Fabricamos muebles, espejos y libros artesanales. Distribuimos en <strong>Misiones</strong> y <strong>Corrientes</strong>, y hacemos envíos a todo el país.
          </p>
        </div>
      </section>

      <section className="sectores">
        <h2 className="sectores-titulo">Nuestros sectores</h2>
        <div className="sectores-grid">
          <Link href="/muebles" className="sector-card sector-muebles">
            <div className="sector-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="5" width="16" height="7" rx="1" />
                <path d="M6 12v7M10 12v7M14 12v7M18 12v7" />
                <path d="M2 13h20" />
              </svg>
            </div>
            <h3>Muebles</h3>
            <p>Calidad y diseño en cada pieza para tu hogar.</p>
            <span className="sector-btn">Ver muebles</span>
          </Link>

          <Link href="/espejos" className="sector-card sector-espejos">
            <div className="sector-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="3" width="14" height="16" rx="2" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </div>
            <h3>Espejos <span className="proximamente">Próximamente</span></h3>
            <p>Todos los estilos y tamaños. Pronto disponible.</p>
            <span className="sector-btn">Ver espejos</span>
          </Link>

          <Link href="/libros" className="sector-card sector-libros">
            <div className="sector-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5C9.5 3.5 7 3 4 3v14c3 0 5.5.5 8 2 2.5-1.5 5-2 8-2V3c-3 0-5.5.5-8 2z" />
                <line x1="12" y1="5" x2="12" y2="19" />
              </svg>
            </div>
            <h3>Libros <span className="proximamente">Próximamente</span></h3>
            <p>Literatura y cultura. Pronto disponible.</p>
            <span className="sector-btn">Ver libros</span>
          </Link>
        </div>
      </section>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Consultar por WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <footer className="home-footer">
        <img src="/logo-footer.jpeg" alt="Logo MuebleG&C" className="home-footer-logo" />
      </footer>
    </div>
  )
}
