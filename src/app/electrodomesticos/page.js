import { prisma } from '@/lib/prisma'
import ProductGridClient from '@/components/ProductGridClient'
import FilterSidebar from '@/components/FilterSidebar'

export const revalidate = 3600

export default async function ElectrodomesticosPage() {
  const productos = await prisma.producto.findMany({
    where: { visible: true, categoria: 'electrodomesticos' },
    orderBy: { id: 'asc' },
  })

  return (
    <div className="catalog-layout">
      <FilterSidebar />
      <ProductGridClient productos={productos} categoria="electrodomesticos" />
    </div>
  )
}
