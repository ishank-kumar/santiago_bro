import { ClerkProvider } from "@clerk/nextjs";
import Script from 'next/script';
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import UserSync from "@/components/Auth/UserSync";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Santiago Bros | Luxury Furniture & Interior Design",
  description: "Curators of exceptional Mediterranean furniture and timeless interior design.",
};

export default async function RootLayout({ children }) {
  let userId = null;
  try {
    const authObj = await auth();
    userId = authObj.userId;
  } catch (e) {
    console.warn('[Clerk] auth() detection warming up...', e.message);
  }

  // Fetch the role from MongoDB if the user is logged in
  const dbUser = userId ? await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true }
  }) : null;

  const dbRole = dbUser?.role || 'USER';
  console.log(`[DEBUG] Server Identity - userId: ${userId}, dbUser Result:`, dbUser ? JSON.stringify(dbUser) : 'null');
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            {/* The matchMedia polyfill must load first to stabilize UI libraries */}
            <script src="/polyfill-listener.js" async={false} />
          </head>
          <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen`}>
            <Navbar dbRole={dbRole} serverUserId={userId} />
            <UserSync />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Toaster position="bottom-right" richColors />
            </ThemeProvider>
            <Footer />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
