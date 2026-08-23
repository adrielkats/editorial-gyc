# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.2.9 (App Router) + React 19.2.4 + Neon PostgreSQL + Prisma 5.22.0 + Cloudinary CDN. CSS plano, sin framework de estilos. Deploy en Vercel (https://mueblegyc.vercel.app).

## Users

Comprador final: cliente común que entra desde un celular de gama baja, navega la grilla de muebles y consulta por WhatsApp para encargar o comprar. No hay registro de usuarios ni cuentas.

## Product Purpose

Sitio catálogo de la mueblería MuebleG&C: muestra los productos (muebles, espejos y libros) con foto y nombre en la grilla, y los datos completos (descripción, precio, stock, botón de WhatsApp) en la página de detalle. El éxito es que el visitante encuentre rápido lo que busca y arranque la conversación de compra por WhatsApp.

## Positioning

Catálogo liviano orientado a la venta informal por WhatsApp, sin carrito ni pago online: el sitio es el escaparate y el chat es el canal de venta. Se diferencia por estar optimizado para celulares gama baja (imágenes servidas por CDN y transformadas para pesar pocos KB).

## Operating Context

- WhatsApp de venta: +54 9 3764 37-6384 (unico canal de contacto/compra).
- Categorías: muebles, espejos y libros. Hoy cargados: 26 productos de muebles con imagen; espejos y libros todavía sin cargar.
- Contenido administrable desde un panel admin (modal con contraseña) que permite alta/edición/borrado de productos e imagen.

## Capabilities and Constraints

- API con Next.js route handlers sobre Prisma + Neon (PostgreSQL serverless).
- Imágenes almacenadas en Cloudinary (URLs), no en la DB; grilla usa `w_400,f_auto,q_80` y detalle `w_800,f_auto,q_80`.
- La grilla pública muestra solo imagen clickable + nombre; precio, descripción, stock y WhatsApp quedan en el detalle.
- Toda mutación (POST/PUT/DELETE) exige header `x-admin-key`.
- Los productos tienen campo `visible`; solo los visibles aparecen.
- Restricción durables: el sitio debe seguir siendo muy liviano para celulares gama baja.

## Brand Commitments

- Nombre: MuebleG&C.
- Acentos de madera/crema en la identidad (fondo del footer `#F4EFE8`); el usuario pidió mantener esta estética actual.
- Contraseña de admin: `Adriel2018`.

## Evidence on Hand

- 26 productos reales de muebles cargados con fotos reales (URLs de Cloudinary).
- Logo de pie de página en `public/logo-footer.jpeg`.
- Site en producción en https://mueblegyc.vercel.app.

## Product Principles

- La grilla debe cargar instantáneo en celulares gama baja: imágenes pequeñas por CDN, poco peso total.
- La ruta principal del visitante es grilla -> detalle -> WhatsApp; nada debe interponerse.
- Lo que se muestra en público es solo lo necesario para decidir; lo operativo (precios, stock, edición) vive en el admin.
- La estética de madera/crema se conserva como identidad, no se rediseña sin pedido explícito.

## Accessibility & Inclusion

- Sin requisito accesible específico confirmado; se mantienen buenas prácticas básicas (imágenes con alt, contraste suficiente).
