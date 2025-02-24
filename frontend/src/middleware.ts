import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/auth']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!token && !isPublicRoute) {
    const response = NextResponse.redirect(new URL('/auth', request.url))
    return response
  }

  if (token && isPublicRoute && request.nextUrl.pathname !== '/') {
    const response = NextResponse.redirect(new URL('/', request.url))
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts).*)',
  ],
}
