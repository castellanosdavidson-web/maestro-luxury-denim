"use client";

import Image from "next/image";

const masters = [
  {
    name: "Valentina R.",
    role: "Fashion Editor",
    quote: "El denim que redefinió mi armario. La estructura de la chaqueta es simplemente perfecta.",
    image: "/uploads/maestro_style_1.png",
  },
  {
    name: "Isabella G.",
    role: "Directora Creativa",
    quote: "La atención al detalle en cada costura justifica completamente la experiencia de lujo.",
    image: "/uploads/maestro_style_2.png",
  },
  {
    name: "Camila V.",
    role: "Arquitecta",
    quote: "Una silueta poderosa que me acompaña de la oficina a eventos exclusivos.",
    image: "/uploads/maestro_style_3.png",
  },
  {
    name: "Sofía M.",
    role: "Empresaria",
    quote: "Nunca había sentido que el denim pudiera ser tan sofisticado hasta que probé MAESTRO.",
    image: "/uploads/maestro_style_4.png",
  },
  {
    name: "Elena P.",
    role: "Consultora de Arte",
    quote: "Una obra de arte ponible. El lavado y el peso de la tela gritan exclusividad.",
    image: "/uploads/maestro_style_5.png",
  },
];

// Se duplica el array para lograr el efecto de scroll infinito sin cortes
const marqueeItems = [...masters, ...masters];

export default function StyleMasters() {
  return (
    <section className="py-24 bg-maestro-carbon overflow-hidden border-t border-maestro-bone/5 relative">
      <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl text-editorial text-maestro-bone mb-6 uppercase tracking-wider">
          Maestros del Estilo
        </h2>
        <p className="text-sm md:text-base text-maestro-bone/60 font-light max-w-2xl mx-auto tracking-wide">
          Casos de éxito y musas que imponen tendencia. Descubre cómo nuestras clientas más exclusivas llevan la experiencia MAESTRO en su día a día.
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex overflow-hidden">
        {/* Gradient fades for smooth edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-maestro-carbon to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-maestro-carbon to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] gap-6 px-3 w-[max-content]">
          {marqueeItems.map((master, idx) => (
            <div 
              key={idx} 
              className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px] flex-shrink-0 group cursor-pointer border border-maestro-bone/10"
            >
              <Image 
                src={master.image} 
                alt={master.name} 
                fill
                className="object-cover object-center filter grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 300px, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark/95 via-maestro-dark/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-1.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#C8A96B" stroke="#C8A96B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-sm md:text-base text-maestro-bone italic font-light mb-6 text-editorial leading-relaxed opacity-90">
                  "{master.quote}"
                </p>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-maestro-gold font-bold">{master.name}</p>
                  <p className="text-[10px] tracking-widest text-maestro-bone/40 uppercase mt-1.5">{master.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
