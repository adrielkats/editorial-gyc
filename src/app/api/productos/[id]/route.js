import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  const { id } = await params
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
  })
  if (!producto) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  return NextResponse.json(producto)
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen: body.imagen || '',
    },
  })
  return NextResponse.json(producto)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.producto.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
