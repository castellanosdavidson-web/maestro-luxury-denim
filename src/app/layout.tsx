import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAESTRO | Luxury Denim",
  description: "Diseñado para mujeres que imponen estilo. Denim premium, edición limitada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-maestro-gold selection:text-maestro-dark">
        <SmoothScroll>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
