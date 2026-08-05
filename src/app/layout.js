import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  metadataBase: new URL('https://editorial-gyc.vercel.app'),
  title: { default: 'MuebleG&C | Muebles, espejos y libros', template: '%s | MuebleG&C' },
  description: 'Muebles, espejos y libros artesanales en Misiones y Corrientes. Fabricación propia y envíos a todo el país.',
  icons: { icon: '/logo-footer.jpeg' },
  openGraph: {
    title: 'MuebleG&C',
    description: 'Muebles, espejos y libros artesanales. Fabricación propia con envíos a todo el país.',
    siteName: 'MuebleG&C',
    type: 'website',
  },
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
