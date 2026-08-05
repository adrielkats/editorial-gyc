import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request) {
  const { imagen } = await request.json()
  if (!imagen || !imagen.startsWith('data:')) {
    return NextResponse.json({ error: 'Imagen inválida' }, { status: 400 })
  }

  const result = await cloudinary.uploader.upload(imagen, {
    folder: 'mueblegyc',
  })

  return NextResponse.json({ url: result.secure_url })
}
