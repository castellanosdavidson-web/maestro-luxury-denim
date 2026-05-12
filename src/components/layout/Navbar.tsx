"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [megamenuItems, setMegamenuItems] = useState<any[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch dinámico del megamenu
    fetch('/api/megamenu').then(res => res.json()).then(data => {
      if (data.items) setMegamenuItems(data.items);
    });

    // Fetch para logo
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.logoUrl) setLogoUrl(data.logoUrl);
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Colecciones", href: "/collections" },
    { name: "Blusas y Corset", href: "/category/blusas-y-corset" },
    { name: "Chaquetas", href: "/category/chaquetas" },
    { name: "Gabardinas", href: "/category/gabardinas" },
    { name: "Chalecos", href: "/category/chalecos" },
    { name: "Faldas", href: "/category/faldas" },
    { name: "Vestidos", href: "/category/vestidos" },
    { name: "Pantalones", href: "/category/pantalones" },
    { name: "Enterizo", href: "/category/enterizo" },
    { name: "The Journal", href: "/journal" },
  ];

  return (
    <nav
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled ? "bg-maestro-dark/90 backdrop-blur-md py-4 border-b border-maestro-bone/5" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
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
        <div className="hidden lg:flex space-x-4 xl:space-x-6 items-center text-[10px] xl:text-xs tracking-wider uppercase">
          {navLinks.map((link) => {
            if (link.name === "Colecciones") {
              return (
                <div 
                  key={link.name}
                  className="relative group py-6"
                >
                  <Link
                    href={link.href}
                    className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 whitespace-nowrap peer"
                  >
                    {link.name}
                  </Link>
                  {/* Megamenu Panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-maestro-dark/95 backdrop-blur-xl border border-maestro-bone/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out transform group-hover:translate-y-0 translate-y-4 flex">
                    <div className="w-1/3 bg-maestro-carbon/50 p-8 flex flex-col justify-between border-r border-maestro-bone/5">
                      <div>
                        <h3 className="text-editorial text-2xl text-maestro-bone mb-2">Colección</h3>
                        <p className="text-maestro-bone/60 text-xs font-light tracking-wide leading-relaxed">
                          Descubre todas las piezas de nuestra última campaña. Denim premium diseñado para empoderar.
                        </p>
                      </div>
                      <Link href="/collections" className="text-[10px] uppercase tracking-widest text-maestro-gold hover:text-maestro-bone flex items-center gap-2 transition-colors">
                        Ver Colección Completa <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div className="w-2/3 p-8 grid grid-cols-3 gap-6">
                      {(megamenuItems.length > 0 ? megamenuItems : [
                        { name: "Chaquetas", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600", href: "/category/chaquetas" },
                        { name: "Vestidos", img: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=600", href: "/category/vestidos" },
                        { name: "Enterizos", img: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=600", href: "/category/enterizo" }
                      ]).slice(0,3).map((item: any) => (
                        <Link href={item.href} key={item.name} className="group/item">
                          <div className="aspect-[3/4] bg-maestro-carbon mb-3 overflow-hidden">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale-[30%] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-700" />
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-maestro-bone text-center group-hover/item:text-maestro-gold transition-colors">{item.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            
            // Resto de los enlaces
            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 whitespace-nowrap"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex space-x-6 items-center">
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-maestro-dark z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl text-editorial tracking-widest">MAESTRO</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} className="text-maestro-bone hover:text-maestro-gold" />
              </button>
            </div>
            <div className="flex flex-col space-y-8 text-xl tracking-widest uppercase text-editorial">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-maestro-bone hover:text-maestro-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
