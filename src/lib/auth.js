import crypto from 'crypto'

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Adriel2018'
const SECRET = ADMIN_PASS + '_s3cur3_s4lt_f0r_h4mac'
const COOKIE_NAME = 'admin_session'
const FLAG_NAME = 'admin_flag'
const SESSION_HOURS = 3

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
}

export function createToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  const payload = String(expires)
  return `${payload}:${sign(payload)}`
}

export function validateToken(token) {
  if (!token) return false
  const idx = token.lastIndexOf(':')
  if (idx === -1) return false
  const expiresStr = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  if (sig !== sign(expiresStr)) return false
  return Date.now() < Number(expiresStr)
}

export function isAdmin(request) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    return validateToken(token)
  } catch {
    return false
  }
}

export function verifyPassword(pass) {
  return pass === ADMIN_PASS
}

export function setAdminCookies(response) {
  const maxAge = SESSION_HOURS * 60 * 60
  const secure = process.env.NODE_ENV === 'production'
  const token = createToken()
  response.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge })
  response.cookies.set(FLAG_NAME, '1', { httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge })
}

export function clearAdminCookies(response) {
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  response.cookies.set(FLAG_NAME, '', { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
}
