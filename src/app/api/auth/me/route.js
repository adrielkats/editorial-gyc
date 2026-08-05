import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'

export async function GET(request) {
  return NextResponse.json({ admin: isAdmin(request) })
}
