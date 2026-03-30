import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/about(.*)', 
  '/products(.*)', 
  '/brands(.*)', 
  '/projects(.*)', 
  '/showroom(.*)', 
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export const proxy = clerkMiddleware(async (auth, request) => {
  // If the user is trying to access an admin route
  if (isAdminRoute(request)) {
    const { userId } = await auth();
    
    if (!userId) {
      const url = new URL('/sign-in', request.url);
      return Response.redirect(url);
    }

    try {
      // Fetch the role from our secure API using the browser's credentials (cookies)
      const response = await fetch(`${request.nextUrl.origin}/api/user/me`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      
      const userData = await response.json();
      console.log(`[Middleware] User: ${userId}, Role: ${userData?.role}`);
      
      // We strictly verify the MongoDB 'ADMIN' role
      if (userData?.role !== 'ADMIN') {
        const url = new URL('/', request.url);
        return Response.redirect(url);
      }
    } catch (e) {
      // Default to redirecting on error (safer for admin routes)
      const url = new URL('/', request.url);
      return Response.redirect(url);
    }
  }

  // General protection for non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
