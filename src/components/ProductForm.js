'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const MAX_ANCHO = 1200

function esBase64(str) {
  return str && str.startsWith('data:')
}

export default function ProductForm({ productoInicial, onSubmit, titulo }) {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const iniciales = Array.isArray(productoInicial?.imagenes) && productoInicial.imagenes.length > 0
    ? productoInicial.imagenes.filter(Boolean)
    : (productoInicial?.imagen ? [productoInicial.imagen] : [])

  const [form, setForm] = useState({
    categoria: productoInicial?.categoria || 'muebles',
    nombre: productoInicial?.nombre || '',
    descripcion: productoInicial?.descripcion || '',
    precio: productoInicial?.precio || '',
    stock: productoInicial?.stock || '',
    imagenes: iniciales
  })
  const [urlNueva, setUrlNueva] = useState('')
  const [guardando, setGuardando] = useState(false)

  function cambiar(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function redimensionar(archivo, maxAncho) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxAncho) {
          height = Math.round((height * maxAncho) / width)
          width = maxAncho
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = URL.createObjectURL(archivo)
    })
  }

  async function manejarArchivos(e) {
    const archivos = Array.from(e.target.files || [])
    if (archivos.length === 0) return
    const nuevos = []
    for (const archivo of archivos) {
      if (archivo.size > 5 * 1024 * 1024) {
        alert(`La imagen "${archivo.name}" es muy grande. Máximo 5MB.`)
        continue
      }
      nuevos.push(await redimensionar(archivo, MAX_ANCHO))
    }
    setForm(prev => ({ ...prev, imagenes: [...prev.imagenes, ...nuevos].filter(Boolean).slice(0, 15) }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function agregarUrl(e) {
    e.preventDefault()
    const url = urlNueva.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      alert('Pegá una URL válida que empiece con http:// o https://')
      return
    }
    setForm(prev => ({ ...prev, imagenes: [...prev.imagenes, url].slice(0, 15) }))
    setUrlNueva('')
  }

  function quitarImagen(idx) {
    setForm(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== idx) }))
  }

  function hacerPortada(idx) {
    setForm(prev => {
      const imagenes = [...prev.imagenes]
      const [imagen] = imagenes.splice(idx, 1)
      return { ...prev, imagenes: [imagen, ...imagenes] }
    })
  }

  async function manejarSubmit(e) {
    e.preventDefault()
    if (guardando) return
    if (!form.nombre.trim()) {
      alert('El nombre del producto es obligatorio')
      return
    }
    setGuardando(true)
    try {
      await onSubmit({
        categoria: form.categoria,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        imagenes: form.imagenes,
        imagen: form.imagenes[0] || ''
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="form-container">
      <h2>{titulo || 'Producto'}</h2>
      <form onSubmit={manejarSubmit}>
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" value={form.categoria} onChange={cambiar} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit' }}>
            <option value="muebles">Muebles</option>
            <option value="espejos">Espejos</option>
            <option value="libros">Libros</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del producto</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            placeholder="Ej: Silla de madera"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            placeholder="Describe el producto..."
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio ($)</label>
          <input
            id="precio"
            name="precio"
            type="number"
            value={form.precio}
            onChange={cambiar}
            placeholder="Ej: 45000"
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock (cantidad disponible)</label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={cambiar}
            placeholder="Ej: 10"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Fotos del producto ({form.imagenes.length})</label>
          <div className="imagen-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={manejarArchivos}
              style={{ display: 'none' }}
              id="file-input"
            />
            <button type="button" className="btn btn-azul" onClick={() => fileInputRef.current?.click()}>
              Subir fotos
            </button>
            <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
              La primera foto es la portada de la grilla. Podés subir varias a la vez.
            </span>
          </div>

          <div className="form-group" style={{ marginTop: '0.6rem', marginBottom: '0' }}>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <input
                value={urlNueva}
                onChange={e => setUrlNueva(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') agregarUrl(e) }}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-gris btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={agregarUrl}>Agregar URL</button>
            </div>
          </div>

          {form.imagenes.length > 0 && (
            <div className="imagenes-preview">
              {form.imagenes.map((imagen, idx) => (
                <div key={idx} className="imagen-preview-item">
                  <img src={imagen} alt={`Vista previa ${idx + 1}`} />
                  {idx === 0 && <span className="imagen-portada-badge">Portada</span>}
                  <div className="imagen-preview-acciones">
                    {idx !== 0 && (
                      <button type="button" className="btn btn-naranja btn-sm" onClick={() => hacerPortada(idx)}>Hacer portada</button>
                    )}
                    <button type="button" className="btn btn-rojo btn-sm" onClick={() => quitarImagen(idx)}>Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-acciones">
          <button type="submit" className="btn btn-verde" disabled={guardando}>
            {guardando ? 'Guardando...' : (productoInicial ? 'Guardar cambios' : 'Crear producto')}
          </button>
          <button type="button" className="btn btn-gris" onClick={() => router.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
