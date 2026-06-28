'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductForm({ productoInicial, onSubmit, titulo }) {
  const router = useRouter()

  const [form, setForm] = useState({
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

  return (
    <div className="form-container">
      <h2>{titulo || 'Producto'}</h2>
      <form onSubmit={manejarSubmit}>
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
          <label htmlFor="imagen">URL de la imagen</label>
          <input
            id="imagen"
            name="imagen"
            value={form.imagen}
            onChange={cambiar}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
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
