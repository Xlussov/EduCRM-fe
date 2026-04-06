import { ALLOWED_PATHS } from '@/shared/routes';
import { Role, ROLES } from '@/shared/types';
import { decodeJwtPayload } from '@/shared/utils/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith('/login')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (token && !isAuthPage) {
    const payload = decodeJwtPayload(token);
    const userRole = payload?.role as Role;

    if (!userRole || !ALLOWED_PATHS[userRole]) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    let isAllowed = false;

    if (userRole === ROLES.SUPERADMIN) {
      isAllowed = true;
    } else {
      const allowedPaths = ALLOWED_PATHS[userRole];
      
      isAllowed = allowedPaths.some((allowedPath) => {
        if (path === allowedPath) return true;
        
        if (allowedPath !== '/' && path.startsWith(`${allowedPath}/`)) return true;
        
        return false;
      });
    }

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}