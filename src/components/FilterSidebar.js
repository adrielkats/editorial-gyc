'use client'

export default function FilterSidebar() {
  return (
    <aside className="filter-sidebar">
      <div className="filter-block">
        <h3 className="filter-title">Categorías</h3>
        <ul className="filter-list">
          <li><a href="/muebles" className="filter-link active">Muebles</a></li>
          <li><a href="/espejos" className="filter-link">Espejos</a></li>
          <li><a href="/libros" className="filter-link">Libros</a></li>
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
