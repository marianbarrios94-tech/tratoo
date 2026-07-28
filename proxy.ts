import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

const ROLE_HOME: Record<string, string> = {
  professional: '/panel',
  admin: '/panel',
  client: '/cuenta',
}

export async function proxy(request: NextRequest) {
  const { response, user, role } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isPanel = pathname.startsWith('/panel')
  const isCuenta = pathname.startsWith('/cuenta')

  if ((isPanel || isCuenta) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isPanel && role && role !== 'professional' && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = ROLE_HOME[role] ?? '/'
    return NextResponse.redirect(url)
  }

  if (isCuenta && role === 'professional') {
    const url = request.nextUrl.clone()
    url.pathname = '/panel'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
