import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, Geist } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Footer from "@/components/layout/Footer";
import PromoPopup from "@/components/PromoPopup";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import PartnersCarousel from "@/components/layout/PartnersCarousel";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAESTRO | Luxury Denim Colombia",
  description: "Denim premium de lujo diseñado para mujeres que imponen estilo. Jeans, chaquetas, blusas y más. Edición limitada. Envíos a toda Colombia.",
  keywords: ["denim premium colombia", "jeans de lujo", "maestro denim", "ropa mujer colombia", "chaquetas denim", "jeans premium mujer", "moda de lujo bogota"],
  openGraph: {
    title: "MAESTRO | Luxury Denim",
    description: "Diseñado para mujeres que imponen estilo. Denim premium, edición limitada.",
    url: "https://maestrodeninmluxury.com",
    siteName: "MAESTRO Denim",
    images: [
      {
        url: "https://maestrodeninmluxury.com/og-default.jpg",
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
    google: "fjV9bKyHaFsvrsw_07OQo7DYCkgDJFSjuzTYR7JwvGk",
  },
  metadataBase: new URL("https://maestrodeninmluxury.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(playfair.variable, inter.variable, "font-sans", geist.variable)}>
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2018668862108446');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-maestro-gold selection:text-maestro-dark">
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=2018668862108446&ev=PageView&noscript=1" />
        </noscript>
        <SmoothScroll>
          <CartProvider>
            {children}
            <PartnersCarousel />
            <Footer />
            <CartSidebar />
            <PromoPopup />
            <FloatingWhatsApp />
          </CartProvider>
        </SmoothScroll>
        {/* Organization Schema.org — señal de autoridad para Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            "name": "MAESTRO Luxury Denim",
            "url": "https://maestrodeninmluxury.com",
            "logo": "https://maestrodeninmluxury.com/logo.png",
            "description": "Denim premium de lujo diseñado para mujeres que imponen estilo. Edición limitada.",
            "address": { "@type": "PostalAddress", "addressCountry": "CO" },
            "sameAs": [
              "https://www.instagram.com/maestrodeninmluxury",
              "https://www.tiktok.com/@maestrodeninmluxury",
            ],
            "priceRange": "$$$",
          }) }}
        />
        <GoogleAnalytics gaId="G-9JMFC48JT9" />
        <GoogleTagManager gtmId="GTM-W46D2X6G" />
      </body>
    </html>
  );
}
