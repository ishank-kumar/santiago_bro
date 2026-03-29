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

// Custom admin route check removed to allow standard auth access

export default clerkMiddleware(async (auth, request) => {
  // Allow any authenticated user to access protected routes (including /admin) during local testing
  
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
