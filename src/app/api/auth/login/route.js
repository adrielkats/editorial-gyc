import { NextResponse } from 'next/server'
import { verifyPassword, setAdminCookies } from '@/lib/auth'

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}))
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  setAdminCookies(response)
  return response
}
