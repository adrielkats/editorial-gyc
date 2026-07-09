import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const muebles = [
  { nombre: 'Ropero 160', descripcion: 'Ropero de pino. Alto 1,60m - Ancho 1,60m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Ropero pino x 80', descripcion: 'Ropero de pino. Alto 1,60m - Ancho 80cm - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Ropero pino x 120', descripcion: 'Ropero de pino. Alto 1,60m - Ancho 1,20m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Placar 2x2,10', descripcion: 'Placar de pino. Alto 2,10m - Ancho 2,00m', categoria: 'muebles' },
  { nombre: 'Placar 160x2,10', descripcion: 'Placar de pino. Alto 2,10m - Ancho 1,60m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Placar 120x2,10', descripcion: 'Placar de pino. Alto 2,10m - Ancho 1,20m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Placar 80x2,10', descripcion: 'Placar de pino. Alto 2,10m - Ancho 80cm - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Placar Maletero', descripcion: 'Placar maletero de MDF. Ancho 1,20m - Alto 1,85m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Cristalero x 120 pata torneada', descripcion: 'Cristalero para cocina de pino con pata torneada. Alto 1,80m - Ancho 1,20m - Profundidad 40cm', categoria: 'muebles' },
  { nombre: 'Cristalero x80', descripcion: 'Cristalero para cocina de pino. Alto 1,70m - Ancho 80cm - Fondo 35cm', categoria: 'muebles' },
  { nombre: 'Alacena pared pino', descripcion: 'Alacena de pared de pino. Alto 70cm - Ancho 1,20m - Profundidad 30cm', categoria: 'muebles' },
  { nombre: 'Bajo mesada', descripcion: 'Bajo mesada de pino. Alto 80cm - Ancho 1,20m - Profundidad 50cm', categoria: 'muebles' },
  { nombre: 'Sommier 80x26', descripcion: 'Sommier 1 plaza. 80cm de ancho, 26cm de espesor. Densidad hasta 80kg', categoria: 'muebles' },
  { nombre: 'Mesa de planchar', descripcion: 'Mesa de planchar de pino. Alto 85cm - Ancho 1,00m - Profundidad 30cm. Incluye tender', categoria: 'muebles' },
  { nombre: 'Sillones caño galvanizado', descripcion: 'Sillones de caño galvanizado. No se oxidan, no se rayan', categoria: 'muebles' },
  { nombre: 'Sillones plegables', descripcion: 'Sillones plegables prácticos y cómodos', categoria: 'muebles' },
  { nombre: 'Mueble anafe x4 con gavetas', descripcion: 'Mueble para anafe de pino con 4 gavetas. Alto 82cm - Ancho 65cm - Profundidad 50cm', categoria: 'muebles' },
  { nombre: 'Mueble anafe x5 con gavetas', descripcion: 'Mueble para anafe de pino con 5 gavetas. Alto 82cm - Ancho 70cm - Profundidad 55cm. Espacio anafe 35,5x60cm', categoria: 'muebles' },
  { nombre: 'Botiquín', descripcion: 'Botiquín de pino. Alto 50cm - Ancho 48cm - Profundidad 15cm', categoria: 'muebles' },
  { nombre: 'Cuchatas para 1 plaza', descripcion: 'Cuchatas de pino para 1 plaza. Largo 1,90m - Ancho 80cm', categoria: 'muebles' },
  { nombre: 'Mesa ratona', descripcion: 'Mesa ratona de pino. Alto 42cm - Ancho 60cm', categoria: 'muebles' },
  { nombre: 'Mesitas de luz', descripcion: 'Mesitas de luz de pino. Alto 53cm - Ancho 40cm - Profundidad 35cm', categoria: 'muebles' },
  { nombre: 'Esquinero', descripcion: 'Esquinero de pino. Alto 1,57m - Ancho 50cm - Profundidad 25cm', categoria: 'muebles' },
  { nombre: 'Comedor 8 puestos', descripcion: 'Comedor de pino para 8 puestos', categoria: 'muebles' },
  { nombre: 'Chifonier 4x2', descripcion: 'Chifonier de pino. Alto 90cm - Ancho 70cm - Profundidad 35cm', categoria: 'muebles' },
  { nombre: 'Anafe x4 hornallas Chamalux', descripcion: 'Anafe a gas de 4 hornallas con vidrio templado. Marca Chamalux', categoria: 'muebles' },
  { nombre: 'Comedor 6 puestos pata Masisa', descripcion: 'Comedor de pino para 6 puestos con pata Masisa. Ancho 90cm - Largo 1,50m', categoria: 'muebles' },
  { nombre: 'Sommier alta densidad', descripcion: 'Colchón de 28cm de espesor, capacidad hasta 110kg por lado. Ancho 100cm (1 plaza y media), largo 1,90m', categoria: 'muebles' },
  { nombre: 'Sommier densidad media', descripcion: 'Colchón de 26cm de espesor, capacidad hasta 80kg por lado. Disponible en 1,30m (2 plazas) y 1,40m (2 plazas y media), largo 1,90m', categoria: 'muebles' },
  { nombre: 'Espaldar bastón', descripcion: 'Espaldar bastón. Medida 1,40m. Consultar colores disponibles', categoria: 'muebles' },
  { nombre: 'Living Santa Fe', descripcion: 'Living Santa Fe en varios colores. Sofá del medio 1,60m - Sofás laterales 1,00m cada uno', categoria: 'muebles' },
  { nombre: 'Living botón', descripcion: 'Living botón. Sofá del medio 1,60m - Sofás laterales 1,00m cada uno', categoria: 'muebles' },
]

async function main() {
  for (const m of muebles) {
    await prisma.producto.create({ data: { ...m, precio: 0, stock: 0 } })
  }
  console.log(`Insertados ${muebles.length} productos de Muebles`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
