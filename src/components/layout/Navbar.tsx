"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
        <Link href="/" className="text-2xl md:text-3xl text-editorial tracking-widest text-maestro-bone hover:text-maestro-gold transition-colors">
          MAESTRO
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-4 xl:space-x-6 items-center text-[10px] xl:text-xs tracking-wider uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-maestro-bone/80 hover:text-maestro-gold transition-colors duration-300 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-6 items-center">
          <button className="text-maestro-bone hover:text-maestro-gold transition-colors">
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
    </nav>
  );
}
