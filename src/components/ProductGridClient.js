'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 12

const TITULOS = {
  muebles: 'Muebles',
  espejos: 'Espejos',
  libros: 'Libros',
  electrodomesticos: 'Electrodomésticos',
}

function quitarAcentos(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function ProductGridClient({ productos: productosIniciales, categoria }) {
  const [productos] = useState(productosIniciales)
  const [esAdmin, setEsAdmin] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')

  const titulo = TITULOS[categoria] || categoria

  const filtrados = useMemo(() => {
    const q = quitarAcentos(busqueda).trim()
    if (!q) return productos
    const palabras = q.split(/\s+/).filter(Boolean)
    return productos.filter(p => {
      const nombre = quitarAcentos(p.nombre)
      const desc = quitarAcentos(p.descripcion)
      return palabras.every(pal => nombre.includes(pal) || desc.includes(pal))
    })
  }, [busqueda, productos])

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE)
  const inicio = (pagina - 1) * PAGE_SIZE
  const paginaActual = filtrados.slice(inicio, inicio + PAGE_SIZE)
  const buscando = busqueda.trim().length > 0

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setEsAdmin(d.admin))
      .catch(() => setEsAdmin(false))
  }, [])

  function cambiarBusqueda(e) {
    setBusqueda(e.target.value)
    setPagina(1)
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  function imgUrl(p) {
    if (!p.imagen) return ''
    if (p.imagen.includes('res.cloudinary.com')) {
      return p.imagen.replace('/image/upload/', '/image/upload/w_400,f_auto,q_80/')
    }
    return p.imagen
  }

  function whatsappMsg(p) {
    return encodeURIComponent(
      `Hola! Quiero consultar por: ${p.nombre}\n\n${p.descripcion}\n\nPrecio: $${Number(p.precio).toLocaleString('es-AR')}`
    )
  }

  return (
    <div>
      <div className="categoria-header">
        <div>
          <h2>{titulo}</h2>
          <p className="categoria-count">
            {buscando ? (
              <>
                {filtrados.length} de {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
              </>
            ) : (
              <>{productos.length} producto{productos.length !== 1 ? 's' : ''}</>
            )}
            {' '}{esAdmin && <span className="admin-badge">Admin</span>}
          </p>
        </div>
        {esAdmin && (
          <Link href={`/productos/nuevo?categoria=${categoria}`} className="btn btn-verde">
            + Nuevo producto
          </Link>
        )}
      </div>

      <div className="busqueda-box">
        <svg className="busqueda-icono" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={busqueda}
          onChange={cambiarBusqueda}
          placeholder={`Buscar en ${titulo.toLowerCase()} (ej: Biblia)...`}
          aria-label={`Buscar en ${titulo}`}
        />
        {busqueda && (
          <button
            type="button"
            className="busqueda-limpiar"
            onClick={() => { setBusqueda(''); setPagina(1) }}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {productos.length === 0 ? (
        <div className="vacio">
          <p>No hay productos en esta categoría todavía.</p>
          <a href="https://wa.me/5493764376384?text=Hola!%20Quiero%20consultar%20por%20un%20producto." target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-whatsapp-sm">Consultar por WhatsApp</a>
        </div>
      ) : buscando && filtrados.length === 0 ? (
        <div className="vacio">
          <p>No encontramos productos para &ldquo;{busqueda}&rdquo;.</p>
          <button
            type="button"
            className="btn btn-gris"
            onClick={() => { setBusqueda(''); setPagina(1) }}
          >
            Borrar búsqueda
          </button>
        </div>
      ) : (
        <>
          <div className="productos-grid-redesign">
            {paginaActual.map(p => (
              <div className="producto-card-redesign" key={p.id}>
                <Link href={`/productos/${p.id}`} className="producto-card-link">
                  <div className="producto-card-img-wrap">
                    {p.imagen ? (
                      <img src={imgUrl(p)} alt={p.nombre} loading="lazy" />
                    ) : (
                      <div className="producto-card-img-empty">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="producto-card-info">
                    <h3 className="producto-card-nombre">{p.nombre}</h3>
                    {p.precio > 0 && (
                      <span className="producto-card-precio">
                        ${Number(p.precio).toLocaleString('es-AR')}
                      </span>
                    )}
                    <span className="producto-card-cta">Ver más &rarr;</span>
                  </div>
                </Link>
                <div className="producto-card-bottom">
                  <a
                    href={`https://wa.me/5493764376384?text=${whatsappMsg(p)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="producto-card-whatsapp"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Consultar
                  </a>
                  {esAdmin && (
                    <div className="producto-card-admin">
                      <Link href={`/productos/${p.id}/editar`} className="btn btn-naranja btn-sm">Editar</Link>
                      <button className="btn btn-rojo btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
              >
                &laquo; Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pagination-num ${n === pagina ? 'active' : ''}`}
                  onClick={() => setPagina(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
