import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')

  const where = categoria ? { categoria } : {}
  const productos = await prisma.producto.findMany({ where, orderBy: { id: 'asc' } })
  return NextResponse.json(productos)
}

export async function POST(request) {
  const body = await request.json()
  const producto = await prisma.producto.create({
    data: {
      categoria: body.categoria || 'muebles',
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen: body.imagen || '',
    },
  })
  return NextResponse.json(producto, { status: 201 })
}
