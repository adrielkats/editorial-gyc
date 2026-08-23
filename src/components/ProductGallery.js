'use client'

import { useState } from 'react'

export default function ProductGallery({ fotos, nombre }) {
  const [actual, setActual] = useState(0)

  if (!fotos || fotos.length === 0) return null

  const idx = Math.min(actual, fotos.length - 1)
  const foto = fotos[idx]

  return (
    <div className="galeria">
      <div className="galeria-imagen-principal">
        {foto && <img src={foto.grande || foto.miniatura} alt={nombre} />}
      </div>
      {fotos.length > 1 && (
        <div className="galeria-miniaturas" role="group" aria-label="Otras fotos del producto">
          {fotos.map((f, i) => (
            <button
              key={i}
              type="button"
              className={i === idx ? 'galeria-miniatura activa' : 'galeria-miniatura'}
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={f.miniatura || f.grande} alt={`${nombre} foto ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
