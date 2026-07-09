import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* HERO CON BANDERA */}
      <section className="hero">
        <div className="flag-bg">
          <div className="flag-stripe flag-blue" />
          <div className="flag-stripe flag-white" />
          <div className="flag-stripe flag-blue" />
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <h1>MuebleG&amp;C</h1>
            <p className="hero-slogan">Calidad y diseño para tu hogar</p>
          </div>
        </div>
      </section>

      {/* DESCRIPCIÓN EMPRESA */}
      <section className="about">
        <div className="about-inner">
          <h2>Sobre nosotros</h2>
          <p>
            En <strong>MuebleG&amp;C</strong> nos dedicamos a la fabricación y
            comercialización de muebles, espejos y libros con los más altos estándares
            de calidad. Trabajamos artesanalmente cada pieza para brindar productos
            únicos que transforman tus espacios.
          </p>
          <p>
            Distribuimos en toda la región, llegando a <strong>Misiones</strong>,
            <strong> Corrientes</strong> y zonas aledañas. Hacemos envíos a todo el
            país con la seguridad y el cuidado que tus muebles merecen.
          </p>
        </div>
      </section>

      {/* SECTORES */}
      <section className="sectores">
        <h2 className="sectores-titulo">Nuestros sectores</h2>
        <div className="sectores-grid">
          <Link href="/muebles" className="sector-card sector-muebles">
            <div className="sector-icon">🪑</div>
            <h3>Muebles</h3>
            <p>Encontrá la mejor selección de muebles para tu hogar. Calidad y diseño en cada pieza.</p>
            <span className="sector-btn">Ver muebles</span>
          </Link>

          <Link href="/espejos" className="sector-card sector-espejos">
            <div className="sector-icon">🪞</div>
            <h3>Espejos</h3>
            <p>Espejos de todos los estilos y tamaños. Elegancia que transforma tus espacios.</p>
            <span className="sector-btn">Ver espejos</span>
          </Link>

          <Link href="/libros" className="sector-card sector-libros">
            <div className="sector-icon">📚</div>
            <h3>Libros</h3>
            <p>Literatura, conocimiento y cultura. Descubrí nuestra colección de libros.</p>
            <span className="sector-btn">Ver libros</span>
          </Link>
        </div>
      </section>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/3755213667" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <span>💬</span>
      </a>
    </div>
  )
}
