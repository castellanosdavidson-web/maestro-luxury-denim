"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-maestro-dark text-maestro-bone">
      <Navbar />
      
      <div className="pt-40 pb-32 container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-4">Legal</p>
          <h1 className="text-5xl md:text-7xl font-light leading-none mb-16 italic">
            PolÃ­tica de <span className="text-maestro-bone/30">Privacidad</span>
          </h1>

          <div className="space-y-12 text-maestro-bone/70 leading-relaxed font-light">
            <section>
              <h2 className="text-white text-xl mb-4 font-normal">1. RecopilaciÃ³n de InformaciÃ³n</h2>
              <p>
                En MAESTRO Luxury Denim, valoramos tu privacidad. Recopilamos informaciÃ³n cuando visitas nuestro sitio, realizas un pedido o te comunicas con nosotros vÃ­a WhatsApp. Esto incluye nombre, correo electrÃ³nico, nÃºmero de telÃ©fono y detalles de navegaciÃ³n.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">2. Uso de los Datos</h2>
              <p>
                Utilizamos tu informaciÃ³n para procesar pedidos, mejorar tu experiencia de compra y enviar actualizaciones sobre tu pedido a travÃ©s de nuestra integraciÃ³n con Kapso AI y WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">3. ProtecciÃ³n de Datos</h2>
              <p>
                Implementamos medidas de seguridad avanzadas para proteger tu informaciÃ³n personal. No vendemos ni compartimos tus datos con terceros para fines de marketing sin tu consentimiento explÃ­cito.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">4. Integraciones de Terceros</h2>
              <p>
                Nuestro sitio utiliza Google Analytics para seguimiento de trÃ¡fico y Kapso AI para la gestiÃ³n de mensajes de WhatsApp. Ambos servicios cumplen con altos estÃ¡ndares de seguridad y privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">5. Tus Derechos</h2>
              <p>
                Puedes solicitar el acceso, correcciÃ³n o eliminaciÃ³n de tus datos personales en cualquier momento contactÃ¡ndonos a travÃ©s de nuestros canales oficiales.
              </p>
            </section>

            <p className="text-[10px] pt-12 border-t border-white/10 uppercase tracking-widest text-maestro-bone/30">
              Ãšltima actualizaciÃ³n: Mayo 2026 | MAESTRO Luxury Denim
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
