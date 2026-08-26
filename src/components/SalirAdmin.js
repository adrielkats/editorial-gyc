'use client'

export default function SalirAdmin({ className }) {
  async function salir() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.reload()
    }
  }

  return (
    <button type="button" className={className || 'btn btn-gris btn-sm'} onClick={salir}>
      Salir
    </button>
  )
}
