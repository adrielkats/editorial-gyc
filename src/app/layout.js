import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'MuebleG&C',
  description: 'Muebles, espejos y libros de calidad',
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
