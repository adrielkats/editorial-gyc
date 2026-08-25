import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { normalizarImagenes } from '@/lib/imagenes'
import { revalidatePath } from 'next/cache'

const CATEGORIAS = ['muebles', 'espejos', 'libros', 'electrodomesticos']

function revalidarCatalogo() {
  revalidatePath('/')
  revalidatePath('/productos')
  for (const c of CATEGORIAS) revalidatePath(`/${c}`)
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
  const urls = await normalizarImagenes(body.imagenes, body.imagen)
  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      categoria: body.categoria || undefined,
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      stock: Number(body.stock) || 0,
      imagen: urls[0] || '',
      imagenes: urls.length ? urls : [],
    },
  })
  revalidarCatalogo()
  revalidatePath(`/productos/${id}`)
  return NextResponse.json(producto)
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { id } = await params
  const existente = await prisma.producto.findUnique({ where: { id: Number(id) } })
  await prisma.producto.delete({ where: { id: Number(id) } })
  revalidarCatalogo()
  if (existente) revalidatePath(`/productos/${id}`)
  return NextResponse.json({ ok: true })
}
