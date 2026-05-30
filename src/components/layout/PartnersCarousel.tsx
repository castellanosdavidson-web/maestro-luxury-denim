"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Partner {
  id: string;
  name: string;
  website_url: string;
  logo_url: string;
  status: string;
}

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPartners(data.filter(p => p.status === "Activo"));
        }
      })
      .catch(console.error);
  }, []);

  if (partners.length === 0) return null;

  // Duplicar para efecto de scroll infinito
  const doubledPartners = [...partners, ...partners];

  return (
    <section className="bg-maestro-carbon py-12 border-t border-maestro-bone/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-maestro-gold/80">Alianzas y Colaboraciones</h2>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: partners.length * 5, // Ajustar velocidad segÃºn cantidad de logos
          }}
          className="flex items-center gap-16 md:gap-32 px-8"
        >
          {doubledPartners.map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="flex-shrink-0">
              {partner.website_url ? (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block relative h-12 md:h-16 w-32 md:w-48 group/logo">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-contain filter grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500"
                  />
                </a>
              ) : (
                <div className="relative h-12 md:h-16 w-32 md:w-48 group/logo">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-contain filter grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500 cursor-default"
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
