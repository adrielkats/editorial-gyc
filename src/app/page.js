import Link from 'next/link'

export default function Home() {
  return (
    <div className="home">
      <h1>Editorial G&amp;C</h1>
      <p className="subtitle">
        Tu tienda de confianza para muebles de calidad.<br />
        Explorá nuestro catálogo con stock en tiempo real.
      </p>
      <Link href="/productos" className="btn-primary">
        Ver productos
      </Link>
    </div>
  )
}
