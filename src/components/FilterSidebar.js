'use client'

import { usePathname } from 'next/navigation'

export default function FilterSidebar() {
  const ruta = usePathname()

  const categorias = [
    { slug: 'muebles', nombre: 'Muebles' },
    { slug: 'espejos', nombre: 'Espejos' },
    { slug: 'libros', nombre: 'Libros' },
    { slug: 'electrodomesticos', nombre: 'Electrodomésticos' },
  ]

  return (
    <aside className="filter-sidebar">
      <div className="filter-block">
        <h3 className="filter-title">Categorías</h3>
        <ul className="filter-list">
          {categorias.map(c => (
            <li key={c.slug}>
              <a href={`/${c.slug}`} className={ruta.startsWith(`/${c.slug}`) ? 'filter-link active' : 'filter-link'}>
                {c.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Precio</h3>
        <div className="filter-price-row">
          <input type="number" placeholder="Desde" className="filter-price-input" disabled />
          <span className="filter-price-sep">–</span>
          <input type="number" placeholder="Hasta" className="filter-price-input" disabled />
        </div>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Ordenar por</h3>
        <select className="filter-select" disabled>
          <option>Más recientes</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
          <option>Nombre A-Z</option>
        </select>
      </div>

      <div className="filter-block">
        <h3 className="filter-title">Disponibilidad</h3>
        <label className="filter-check">
          <input type="checkbox" disabled /> Solo con stock
        </label>
      </div>
    </aside>
  )
}
