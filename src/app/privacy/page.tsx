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
            Política de <span className="text-maestro-bone/30">Privacidad</span>
          </h1>

          <div className="space-y-12 text-maestro-bone/70 leading-relaxed font-light">
            <section>
              <h2 className="text-white text-xl mb-4 font-normal">1. Recopilación de Información</h2>
              <p>
                En MAESTRO Luxury Denim, valoramos tu privacidad. Recopilamos información cuando visitas nuestro sitio, realizas un pedido o te comunicas con nosotros vía WhatsApp. Esto incluye nombre, correo electrónico, número de teléfono y detalles de navegación.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">2. Uso de los Datos</h2>
              <p>
                Utilizamos tu información para procesar pedidos, mejorar tu experiencia de compra y enviar actualizaciones sobre tu pedido a través de nuestra integración con Kapso AI y WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">3. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad avanzadas para proteger tu información personal. No vendemos ni compartimos tus datos con terceros para fines de marketing sin tu consentimiento explícito.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">4. Integraciones de Terceros</h2>
              <p>
                Nuestro sitio utiliza Google Analytics para seguimiento de tráfico y Kapso AI para la gestión de mensajes de WhatsApp. Ambos servicios cumplen con altos estándares de seguridad y privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl mb-4 font-normal">5. Tus Derechos</h2>
              <p>
                Puedes solicitar el acceso, corrección o eliminación de tus datos personales en cualquier momento contactándonos a través de nuestros canales oficiales.
              </p>
            </section>

            <p className="text-[10px] pt-12 border-t border-white/10 uppercase tracking-widest text-maestro-bone/30">
              Última actualización: Mayo 2026 | MAESTRO Luxury Denim
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
