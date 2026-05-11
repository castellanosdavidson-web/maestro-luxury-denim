"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setSettings(data);
    });
  }, []);
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
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40 mb-2">Soporte</h4>
              <Link href="/faq" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">FAQ</Link>
              <Link href="/terms" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Envíos & Retornos</Link>
              <Link href="/terms" className="text-xs tracking-widest uppercase hover:text-maestro-gold transition-colors">Términos Legales</Link>
            </div>
          </div>
        </div>

        {/* Huge Logo Section */}
        <div className="border-t border-b border-maestro-bone/10 py-16 mb-12 flex flex-col items-center justify-center">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="MAESTRO" className="h-24 md:h-40 object-contain opacity-50 hover:opacity-100 transition-opacity duration-1000 cursor-default" />
          ) : (
            <h2 className="text-[15vw] leading-none text-editorial text-maestro-bone/10 hover:text-maestro-bone/30 transition-colors duration-1000 cursor-default uppercase">
              Maestro
            </h2>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-maestro-bone/40">
          <p>© {new Date().getFullYear()} MAESTRO DENIM. TODOS LOS DERECHOS RESERVADOS.</p>
          
          <div className="flex gap-6">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-maestro-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-maestro-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            )}
            {settings.tiktokUrl && (
              <a href={settings.tiktokUrl} target="_blank" rel="noreferrer" className="hover:text-maestro-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            )}
            {settings.mailUrl && (
              <a href={`mailto:${settings.mailUrl}`} className="hover:text-maestro-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
