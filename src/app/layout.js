export const metadata = {
  title: 'Sitio desactivado',
  description: 'Este sitio no se encuentra disponible.',
}

export default function RootLayout() {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', textAlign: 'center', padding: '2rem',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sitio desactivado</h1>
          <p style={{ color: '#666' }}>Esta página no se encuentra disponible por el momento.</p>
        </div>
      </body>
    </html>
  )
}
