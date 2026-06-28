import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Editorial G&C - Muebles',
  description: 'Catálogo de muebles con stock y descripciones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
