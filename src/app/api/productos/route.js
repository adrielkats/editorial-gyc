import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { normalizarImagenes } from '@/lib/imagenes'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')

  const where = { visible: true, ...(categoria ? { categoria } : {}) }
  const productos = await prisma.producto.findMany({ where, orderBy: { id: 'asc' } })

  return NextResponse.json(productos)
}

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await request.json()
  const urls = await normalizarImagenes(body.imagenes, body.imagen)
  const producto = await prisma.producto.create({
    data: {
      categoria: body.categoria || 'muebles',
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen: urls[0] || '',
      imagenes: urls,
    },
  })
  return NextResponse.json(producto, { status: 201 })
}
