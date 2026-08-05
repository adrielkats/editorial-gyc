import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

const ADMIN_PASS = 'Adriel2018'

function esAdmin(request) {
  return request.headers.get('x-admin-key') === ADMIN_PASS
}

async function subirCloudinary(base64) {
  if (!base64 || !base64.startsWith('data:')) return base64
  const result = await cloudinary.uploader.upload(base64, { folder: 'mueblegyc' })
  return result.secure_url
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')

  const where = { visible: true, ...(categoria ? { categoria } : {}) }
  const productos = await prisma.producto.findMany({ where, orderBy: { id: 'asc' } })

  return NextResponse.json(productos)
}

export async function POST(request) {
  if (!esAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await request.json()
  const imagen = await subirCloudinary(body.imagen)
  const producto = await prisma.producto.create({
    data: {
      categoria: body.categoria || 'muebles',
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen,
    },
  })
  return NextResponse.json(producto, { status: 201 })
}
