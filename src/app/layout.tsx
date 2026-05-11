import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  description: "Diseñado para mujeres que imponen estilo. Denim premium y de lujo, edición limitada.",
  keywords: ["denim", "luxury streetwear", "jeans premium", "maestro denim", "moda femenina", "ropa de lujo colombia", "streetwear mujer"],
  openGraph: {
    title: "MAESTRO | Luxury Denim",
    description: "Diseñado para mujeres que imponen estilo. Denim premium, edición limitada.",
    url: "https://maestro-denim.com", // Cambiar por el dominio final
    siteName: "MAESTRO Denim",
    images: [
      {
        url: "/uploads/hero-custom.jpg", // Asegúrate de tener una imagen por defecto o logo aquí
        width: 1200,
        height: 630,
        alt: "MAESTRO Luxury Denim",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
            <Footer />
            <CartSidebar />
          </CartProvider>
        </SmoothScroll>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
