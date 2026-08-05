'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_KEY = 'gyc-admin'
const MAX_ANCHO = 400

export default function ProductForm({ productoInicial, onSubmit, titulo }) {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    categoria: productoInicial?.categoria || 'muebles',
    nombre: productoInicial?.nombre || '',
    descripcion: productoInicial?.descripcion || '',
    precio: productoInicial?.precio || '',
    stock: productoInicial?.stock || '',
    imagen: productoInicial?.imagen || ''
  })

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
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = URL.createObjectURL(archivo)
    })
  }

  function manejarArchivo(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB.')
      return
    }
    redimensionar(archivo, MAX_ANCHO).then(dataUrl => {
      setForm(prev => ({ ...prev, imagen: dataUrl }))
    })
  }

  function quitarImagen() {
    setForm(prev => ({ ...prev, imagen: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function manejarSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim()) {
      alert('El nombre del producto es obligatorio')
      return
    }
    onSubmit({
      ...form,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0
    })
  }

  function esBase64(str) {
    return str && str.startsWith('data:')
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
          <label>Imagen del producto</label>
          <div className="imagen-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={manejarArchivo}
              style={{ display: 'none' }}
              id="file-input"
            />
            <button type="button" className="btn btn-azul" onClick={() => fileInputRef.current?.click()}>
              Seleccionar imagen
            </button>
            <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>o pegá una URL</span>
          </div>
          {form.imagen && (
            <div className="imagen-preview">
              <img src={form.imagen} alt="Vista previa" />
              <button type="button" className="btn btn-rojo btn-sm" onClick={quitarImagen} style={{ marginTop: '0.5rem' }}>Quitar imagen</button>
            </div>
          )}
          {!esBase64(form.imagen) && (
            <input
              id="imagen"
              name="imagen"
              value={form.imagen}
              onChange={cambiar}
              placeholder="https://ejemplo.com/imagen.jpg"
              style={{ marginTop: '0.5rem' }}
            />
          )}
        </div>

        <div className="form-acciones">
          <button type="submit" className="btn btn-verde">
            {productoInicial ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button type="button" className="btn btn-gris" onClick={() => router.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
