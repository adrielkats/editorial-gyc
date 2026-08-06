import { prisma } from '@/lib/prisma'
import ProductGridClient from '@/components/ProductGridClient'

export const dynamic = 'force-dynamic'

export default async function LibrosPage() {
  const productos = await prisma.producto.findMany({
    where: { visible: true, categoria: 'libros' },
    orderBy: { id: 'asc' },
  })

  return <ProductGridClient productos={productos} categoria="libros" />
}
