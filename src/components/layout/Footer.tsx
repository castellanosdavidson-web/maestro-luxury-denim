"use client";

import Link from "next/link";
import { ArrowRight, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-maestro-carbon text-maestro-bone pt-24 pb-12 border-t border-maestro-bone/5">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Top Section - Newsletter & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Newsletter (Left / 5 cols) */}
          <div className="lg:col-span-5">
            <h3 className="text-sm tracking-[0.3em] uppercase text-maestro-gold mb-6">Únete a MAESTRO</h3>
            <p className="text-maestro-bone/60 font-light text-sm mb-8 leading-relaxed pr-8">
              Suscríbete a The Journal para recibir acceso anticipado a nuestras ediciones limitadas de denim, invitaciones a eventos privados y editoriales exclusivos.
            </p>
            <form className="flex relative border-b border-maestro-bone/30 pb-2 group">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="w-full bg-transparent text-sm tracking-widest text-maestro-bone placeholder:text-maestro-bone/30 outline-none"
                required
              />
              <button type="submit" className="text-maestro-bone/50 group-hover:text-maestro-gold transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links (Right / 6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40 mb-2">Colecciones</h4>
              <Link href="/collections" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Ver Todo</Link>
              <Link href="/category/chaquetas" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Chaquetas</Link>
              <Link href="/category/pantalones" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Pantalones</Link>
              <Link href="/category/vestidos" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Vestidos</Link>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40 mb-2">Descubre</h4>
              <Link href="/journal" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">The Journal</Link>
              <Link href="/about" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Nuestra Historia</Link>
              <Link href="/stores" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Boutiques</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40 mb-2">Soporte</h4>
              <Link href="/faq" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">FAQ</Link>
              <Link href="/shipping" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Envíos & Retornos</Link>
              <Link href="/terms" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Términos Legales</Link>
              <Link href="/contact" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Contacto</Link>
            </div>
          </div>
        </div>

        {/* Huge Logo Section */}
        <div className="border-t border-b border-maestro-bone/10 py-16 mb-12 flex flex-col items-center justify-center">
          <h2 className="text-[15vw] leading-none text-editorial text-maestro-bone/10 hover:text-maestro-bone/30 transition-colors duration-1000 cursor-default uppercase">
            Maestro
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40">
          <p>© {new Date().getFullYear()} MAESTRO DENIM. TODOS LOS DERECHOS RESERVADOS.</p>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-maestro-gold transition-colors"><Instagram size={16} /></a>
            <a href="#" className="hover:text-maestro-gold transition-colors"><Mail size={16} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
