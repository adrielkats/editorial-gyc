import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productos = [
  { nombre: 'Silla de madera', descripcion: 'Silla rústica de madera de pino, ideal para comedor. Fabricada a mano con acabado natural.', precio: 45000, stock: 12, imagen: 'https://placehold.co/400x300/F5F5F5/333?text=Silla' },
  { nombre: 'Mesa ratona', descripcion: 'Mesa baja de centro con tapa de vidrio templado y base de hierro forjado.', precio: 89000, stock: 5, imagen: 'https://placehold.co/400x300/F5F5F5/333?text=Mesa' },
  { nombre: 'Estantería modular', descripcion: 'Estantería apilable de 3 niveles. Ideal para libros, decoración o almacenamiento.', precio: 32000, stock: 8, imagen: 'https://placehold.co/400x300/F5F5F5/333?text=Estanteria' },
  { nombre: 'Escritorio ejecutivo', descripcion: 'Escritorio de oficina con cajones, color nogal oscuro. Medidas: 140x70cm.', precio: 125000, stock: 3, imagen: 'https://placehold.co/400x300/F5F5F5/333?text=Escritorio' },
]

async function main() {
  for (const p of productos) {
    await prisma.producto.create({ data: p })
  }
  console.log('Productos insertados correctamente')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
