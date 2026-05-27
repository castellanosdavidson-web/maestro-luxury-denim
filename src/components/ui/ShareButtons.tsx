"use client";

import { useState, useEffect } from "react";
import { Link2, Check } from "lucide-react";

const FacebookIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
import { motion } from "framer-motion";

export default function ShareButtons({ title, text }: { title: string, text?: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };

  if (!url) return null; // Avoid rendering until URL is known to prevent hydration mismatch

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8 border-t border-b border-maestro-bone/10 my-16">
      <span className="text-[10px] uppercase tracking-[0.2em] text-maestro-bone/50 md:mr-4 w-full md:w-auto text-center">Compartir Artículo:</span>
      
      <a 
        href={shareLinks.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/70 hover:text-maestro-gold hover:border-maestro-gold transition-all"
        title="Compartir en WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>

      <a 
        href={shareLinks.facebook} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/70 hover:text-maestro-gold hover:border-maestro-gold transition-all"
        title="Compartir en Facebook"
      >
        <FacebookIcon size={20} />
      </a>

      <a 
        href={shareLinks.twitter} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/70 hover:text-maestro-gold hover:border-maestro-gold transition-all"
        title="Compartir en X / Twitter"
      >
        <TwitterIcon size={20} />
      </a>

      <button 
        onClick={handleCopy}
        className="w-12 h-12 rounded-full border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/70 hover:text-maestro-gold hover:border-maestro-gold transition-all relative overflow-hidden"
        title="Copiar Enlace"
      >
        <motion.div
          initial={false}
          animate={{ y: copied ? -30 : 0, opacity: copied ? 0 : 1 }}
          className="absolute"
        >
          <Link2 size={20} />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ y: copied ? 0 : 30, opacity: copied ? 1 : 0 }}
          className="absolute text-green-500"
        >
          <Check size={20} />
        </motion.div>
      </button>
    </div>
  );
}
