import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import UserSync from "@/components/Auth/UserSync";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Santiago Bros | Luxury Furniture & Interior Design",
  description: "Curators of exceptional Mediterranean furniture and timeless interior design.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen`}>
            <Navbar />
            <UserSync />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
