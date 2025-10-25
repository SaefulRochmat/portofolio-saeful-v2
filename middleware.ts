import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { getUser } from '@/queries/user';

const PUBLIC_ROUTES: string[] = [
  "/",
  "/login",
  "/signup",
];

const PRIVATE_ROUTES: string[] = ["/dashboard/:path*"];

export async function middleware(request: NextRequest) {
  const user = await getUser();
  const pathname = request.nextUrl.pathname;

  // Redirect logged-in users from public auth routes
  if (user && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-logged-in users from private routes
  if (!user && PRIVATE_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}