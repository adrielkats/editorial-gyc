'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const INTERVALO = 5000

const SECTORES = [
  { slug: 'muebles', etiqueta: 'Muebles' },
  { slug: 'espejos', etiqueta: 'Espejos' },
  { slug: 'libros', etiqueta: 'Libros' },
  { slug: 'electrodomesticos', etiqueta: 'Electrodomésticos' },
]

function barajar(arreglo) {
  const copia = [...arreglo]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function emparejar(arreglo) {
  const pares = []
  for (let i = 0; i < arreglo.length; i += 2) {
    pares.push(arreglo.slice(i, i + 2))
  }
  return pares
}

function imgUrl(imagen) {
  if (!imagen) return ''
  if (imagen.includes('res.cloudinary.com')) {
    return imagen.replace('/image/upload/', '/image/upload/w_400,f_auto,q_80/')
  }
  return imagen
}

export default function ProductosDestacados({ grupos }) {
  const [secuencia, setSecuencia] = useState([])
  const [indice, setIndice] = useState(0)
  const dataRef = useRef({})
  const pausado = useRef(false)

  function generar() {
    const porSector = {}
    for (const s of SECTORES) {
      const prods = dataRef.current[s.slug] || []
      if (prods.length) porSector[s.slug] = emparejar(barajar(prods))
    }

    const sec = []
    let hay = true
    while (hay) {
      hay = false
      for (const s of SECTORES) {
        const lista = porSector[s.slug]
        if (lista && lista.length) {
          const par = lista.shift()
          sec.push({ slug: s.slug, etiqueta: s.etiqueta, par })
          hay = true
        }
      }
    }
    return sec
  }

  useEffect(() => {
    const data = {}
    for (const g of grupos || []) {
      data[g.slug] = (g.productos || []).filter(Boolean)
    }
    dataRef.current = data
    setSecuencia(generar())
    setIndice(0)
  }, [grupos])

  useEffect(() => {
    if (pausado.current || secuencia.length < 2) return
    const t = setTimeout(() => {
      if (indice >= secuencia.length - 1) {
        setSecuencia(generar())
        setIndice(0)
      } else {
        setIndice(indice + 1)
      }
    }, INTERVALO)
    return () => clearTimeout(t)
  }, [indice, secuencia])

  if (secuencia.length === 0) {
    return (
      <div className="destacados-placeholder" aria-hidden="true">
        <div /><div />
      </div>
    )
  }

  const actual = secuencia[indice] || secuencia[0]
  const mostrarDots = secuencia.length > 1 && secuencia.length <= 8

  return (
    <div
      className="destacados-rotativo"
      onMouseEnter={() => { pausado.current = true }}
      onMouseLeave={() => { pausado.current = false }}
      onTouchStart={() => { pausado.current = true }}
      onTouchEnd={() => { pausado.current = false }}
    >
      <div
        className="destacados-track"
        style={{ width: `${secuencia.length * 100}%`, transform: `translateX(-${(indice * 100) / secuencia.length}%)` }}
      >
        {secuencia.map((slide, i) => (
          <div
            className="destacados-slide"
            style={{ flex: `0 0 ${100 / secuencia.length}%` }}
            key={`${i}-${slide.slug}-${slide.par[0]?.id}`}
          >
            <div className="destacados-slide-grid">
              {slide.par.map(p => (
                <Link href={`/productos/${p.id}`} className="producto-card" key={p.id}>
                  {p.imagen && <img src={imgUrl(p.imagen)} alt={p.nombre} className="producto-card-img" loading="lazy" />}
                  <div className="producto-card-body">
                    <span className="destacados-sector-tag">{slide.etiqueta}</span>
                    <h3>{p.nombre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {secuencia.length > 1 && (
        <div className="destacados-nav">
          <button
            type="button"
            className="destacados-flecha"
            onClick={() => setIndice(indice === 0 ? secuencia.length - 1 : indice - 1)}
            aria-label="Anterior"
          >
            &laquo;
          </button>

          {mostrarDots && (
            <div className="destacados-dots">
              {secuencia.map((s, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  className={i === indice ? 'destacados-dot activa' : 'destacados-dot'}
                  onClick={() => setIndice(i)}
                  aria-label={`Ir a ${s.etiqueta}`}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className="destacados-flecha"
            onClick={() => setIndice((indice + 1) % secuencia.length)}
            aria-label="Siguiente"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
