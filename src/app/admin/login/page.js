'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [pass, setPass] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.admin) router.replace('/') })
      .finally(() => setVerificando(false))
  }, [router])

  async function entrar(e) {
    e.preventDefault()
    if (!pass || cargando) return
    setError('')
    setCargando(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      })
      if (res.ok) {
        router.replace('/')
      } else {
        setError('Contraseña incorrecta')
        setPass('')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  if (verificando) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p className="login-verificando">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>MuebleG&C</h1>
          <p>Acceso administrador</p>
        </div>
        <form className="login-form" onSubmit={entrar}>
          <div className="login-field">
            <label htmlFor="login-pass" className="visually-hidden">Contraseña</label>
            <div className="login-input-wrap">
              <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="login-pass"
                type={mostrar ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError('') }}
                placeholder="Contraseña"
                autoFocus
              />
              <button type="button" className="login-toggle" onClick={() => setMostrar(!mostrar)} aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {mostrar ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn" disabled={cargando || !pass}>
            {cargando ? (
              <span className="login-spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" />
                </svg>
                Ingresar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
