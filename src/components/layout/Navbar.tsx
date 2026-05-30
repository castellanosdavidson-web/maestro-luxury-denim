"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "./SearchOverlay";

function MegamenuImageRotate({ imgs, alt }: { imgs: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!imgs || imgs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imgs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [imgs]);

  if (!imgs || imgs.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-maestro-carbon">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={imgs[currentIndex]}
          alt={alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-1000"
        />
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [megamenuItems, setMegamenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("573000000000");

  useEffect(() => {
    setMounted(true);
    let rafId: number;
    const handleScroll = () => {
      // RAF: ejecutar sÃ³lo una vez por frame, no bloquear el hilo principal
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Fetch dinÃ¡mico del megamenu
    fetch('/api/megamenu').then(res => res.json()).then(data => {
      if (data.items) setMegamenuItems(data.items);
    });

    // Fetch dinÃ¡mico de todas las categorÃ­as
    fetch('/api/categories').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setCategories(data.filter(c => c.status === "Activo" || c.status === "Activa" || !c.status));
    });

    // Fetch para logo y redes
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.logoUrl) setLogoUrl(data.logoUrl);
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber.replace(/\D/g, ''));
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Bloquear scroll del body cuando el menÃº mobile estÃ¡ abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Colecciones", href: "/collections" },
    ...categories.map(c => ({ 
      name: c.name, 
      href: `/category/${c.name.toLowerCase().replace(/\s+/g, '-')}` 
    })),
    { name: "The Journal", href: "/journal" },
  ];

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled ? "bg-maestro-dark/90 backdrop-blur-md py-4 border-b border-maestro-bone/5" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 relative flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-maestro-bone hover:text-maestro-gold transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl text-editorial tracking-widest text-maestro-bone hover:text-maestro-gold transition-colors flex items-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="MAESTRO"
              className="h-14 md:h-20 w-auto object-contain max-w-[260px] md:max-w-[340px] transition-opacity duration-300 opacity-100"
            />
          ) : (
            <span className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              MAESTRO
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 space-x-6 xl:space-x-8 items-center text-[10px] xl:text-[11px] tracking-wider uppercase">
          
          {/* Colecciones (Megamenu) */}
          <div className="relative group py-6">
            <Link
              href="/collections"
              className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 whitespace-nowrap peer"
            >
              Colecciones
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-maestro-dark/95 backdrop-blur-xl border border-maestro-bone/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out transform group-hover:translate-y-0 translate-y-4 flex">
              <div className="w-1/3 bg-maestro-carbon/50 p-8 flex flex-col justify-between border-r border-maestro-bone/5">
                <div>
                  <h3 className="text-editorial text-2xl text-maestro-bone mb-2">ColecciÃ³n</h3>
                  <p className="text-maestro-bone/60 text-xs font-light tracking-wide leading-relaxed">
                    Descubre todas las piezas de nuestra Ãºltima campaÃ±a. Denim premium diseÃ±ado para empoderar.
                  </p>
                </div>
                <Link href="/collections" className="text-[10px] uppercase tracking-widest text-maestro-gold hover:text-maestro-bone flex items-center gap-2 transition-colors">
                  Ver ColecciÃ³n Completa <ArrowRight size={14} />
                </Link>
              </div>
              <div className="w-2/3 p-8 grid grid-cols-3 gap-6">
                {(megamenuItems.length > 0 ? megamenuItems : [
                  { name: "Chaquetas", imgs: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"], href: "/category/chaquetas" },
                  { name: "Vestidos", imgs: ["https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=600"], href: "/category/vestidos" },
                  { name: "Enterizos", imgs: ["https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=600"], href: "/category/enterizo" }
                ]).slice(0,3).map((item: any) => (
                  <Link href={item.href} key={item.name} className="group/item flex flex-col">
                    <div className="aspect-[3/4] mb-3 overflow-hidden relative">
                      <MegamenuImageRotate imgs={item.imgs || (item.img ? [item.img] : [])} alt={item.name} />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-maestro-bone text-center group-hover/item:text-maestro-gold transition-colors mt-auto">{item.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Tienda (Dropdown) */}
          <div className="relative group py-6">
            <span className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 cursor-pointer whitespace-nowrap peer">
              Tienda
            </span>
            <div className="absolute top-full left-0 w-56 bg-maestro-dark/95 backdrop-blur-xl border border-maestro-bone/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-4 flex flex-col py-4">
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="px-6 py-3 text-[10px] tracking-widest uppercase text-maestro-bone/70 hover:text-maestro-dark hover:bg-maestro-gold transition-all duration-300 font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Journal */}
          <Link
            href="/journal"
            className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 whitespace-nowrap"
          >
            The Journal
          </Link>
        </div>

        {/* Actions */}
        <div className="flex space-x-5 items-center">
          {/* Social Links for visibility */}
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, estoy interesad@ en cotizar un producto de Maestro Denim Luxury")}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:block text-maestro-bone hover:text-maestro-gold transition-colors"
            title="Chatea con nosotros en WhatsApp"
          >
            <WhatsAppIcon size={20} />
          </a>
          
          <div className="hidden md:block w-px h-4 bg-maestro-bone/20 mx-1"></div>

          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Buscar"
            className="text-maestro-bone hover:text-maestro-gold transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-maestro-bone hover:text-maestro-gold transition-colors relative"
          >
            <ShoppingBag size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-maestro-gold text-maestro-dark text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "#050505",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Header del menÃº */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="MAESTRO"
                    style={{ height: "52px", width: "auto", objectFit: "contain", maxWidth: "200px" }}
                  />
                ) : (
                  <span style={{
                    fontSize: "1.5rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    letterSpacing: "0.15em",
                    color: "#F5F5F5",
                  }}>
                    MAESTRO
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#F5F5F5", padding: "8px" }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + idx * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: "block",
                      fontSize: "1.25rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#F5F5F5",
                      textDecoration: "none",
                      padding: "4px 0",
                      borderBottom: "1px solid rgba(245,245,245,0.06)",
                      paddingBottom: "16px",
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer del menÃº */}
            <div style={{ marginTop: "auto", paddingTop: "48px" }}>
              <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, estoy interesad@ en cotizar un producto de Maestro Denim Luxury")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#F5F5F5", opacity: 0.8 }}>
                  <WhatsAppIcon size={24} />
                </a>
              </div>
              <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.25)" }}>
                MAESTRO Â© Luxury Denim
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </nav>

      {/* Search Overlay */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
