import cloudinary from '@/lib/cloudinary'

async function subirImagen(base64) {
  if (!base64 || !base64.startsWith('data:')) return base64
  const result = await cloudinary.uploader.upload(base64, { folder: 'mueblegyc' })
  return result.secure_url
}

export async function normalizarImagenes(imagenes, imagenActual) {
  const fuentes = Array.isArray(imagenes) && imagenes.length > 0
    ? imagenes
    : (imagenActual ? [imagenActual] : [])

  const urls = []
  for (const src of fuentes) {
    if (!src || typeof src !== 'string') continue
    const url = await subirImagen(src.trim())
    if (url && !urls.includes(url)) urls.push(url)
  }
  return urls
}
