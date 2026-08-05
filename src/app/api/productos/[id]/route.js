import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { isAdmin } from '@/lib/auth'

async function subirCloudinary(base64) {
  if (!base64 || !base64.startsWith('data:')) return base64
  const result = await cloudinary.uploader.upload(base64, { folder: 'mueblegyc' })
  return result.secure_url
}

export async function GET(request, { params }) {
  const { id } = await params
  const producto = await prisma.producto.findUnique({ where: { id: Number(id) } })
  if (!producto || !producto.visible) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  return NextResponse.json(producto)
}

export async function PUT(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const imagen = await subirCloudinary(body.imagen)
  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      categoria: body.categoria || undefined,
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen,
    },
  })
  return NextResponse.json(producto)
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { id } = await params
  await prisma.producto.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
