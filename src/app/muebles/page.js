import { prisma } from '@/lib/prisma'
import ProductGridClient from '@/components/ProductGridClient'

export const dynamic = 'force-dynamic'

export default async function MueblesPage() {
  const productos = await prisma.producto.findMany({
    where: { visible: true, categoria: 'muebles' },
    orderBy: { id: 'asc' },
  })

  return <ProductGridClient productos={productos} categoria="muebles" />
}
