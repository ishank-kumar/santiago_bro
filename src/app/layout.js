import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Santiago Bros | Luxury Furniture & Interior Design",
  description: "Curators of exceptional Mediterranean furniture and timeless interior design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
