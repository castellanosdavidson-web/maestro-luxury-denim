"use client";

import { useState, useEffect } from "react";
import { Upload, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FONT_SIZES = [
  { value: "small",  label: "Pequeño" },
  { value: "medium", label: "Mediano" },
  { value: "large",  label: "Grande" },
  { value: "xlarge", label: "Muy Grande" },
];

const FONT_FAMILIES = [
  { value: "editorial", label: "Editorial (Playfair Display)" },
  { value: "modern",    label: "Moderno (Inter)" },
  { value: "classic",   label: "Clásico (Georgia)" },
  { value: "elegant",   label: "Elegante (Cormorant Garamond)" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    heroTitle:        "",
    heroSubtitle:     "",
    heroCaption:      "",
    heroValueProp:    "",
    heroImage:        "",
    heroVideo:        "",
    heroMarquee:      "",
    heroLinkText:     "",
    whatsappNumber:   "",
    heroFontSize:     "large",
    heroFontFamily:   "editorial",
    instagramUrl:     "",
    facebookUrl:      "",
    tiktokUrl:        "",
    mailUrl:          "",
    logoUrl:          "",
    aboutText:        "",
    faqText:          "",
    termsText:        "",
    // Popup
    popupEnabled:     false as boolean,
    popupImageUrl:    "",
    popupVideoUrl:    "",
    popupTitle:       "",
    popupDescription: "",
    popupLinkUrl:     "",
    popupLinkText:    "Ver ahora",
    popupDelay:       "1",
  });
  const [isLoading,   setIsLoading]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data =>
      setSettings(prev => ({ ...prev, ...data }))
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Valores que no viajan bien en FormData
    formData.set("heroFontSize",   settings.heroFontSize);
    formData.set("heroFontFamily", settings.heroFontFamily);
    // Fix: checkbox desmarcado llega como null → forzar el valor siempre
    formData.set("popupEnabled", settings.popupEnabled ? "on" : "off");

    try {
      await fetch('/api/settings', { method: 'POST', body: formData });
      alert("Cambios guardados correctamente");
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch {
      alert("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl text-editorial text-maestro-bone mb-8">Configuración de Portada</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-maestro-dark border border-maestro-bone/10 p-8 rounded-sm">

        {/* ── Textos ── */}
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4">
            Textos Principales
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Título Principal</label>
              <textarea
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                rows={2}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Subtítulo (Itálica)</label>
              <input
                type="text" name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Caption Superior</label>
              <input
                type="text" name="heroCaption" value={settings.heroCaption} onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Propuesta de Valor</label>
              <input
                type="text" name="heroValueProp" value={settings.heroValueProp} onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Texto de Botón (CTA)</label>
              <input
                type="text" name="heroLinkText" value={settings.heroLinkText} onChange={handleChange}
                placeholder="Ej: Explorar Colección"
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2 text-maestro-gold">Cinta en movimiento (Marquesina)</label>
              <input
                type="text" name="heroMarquee" value={settings.heroMarquee} onChange={handleChange}
                placeholder="Ej: ENVÍO GRATIS EN COLOMBIA • NUEVA COLECCIÓN..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2 text-maestro-gold">Número de WhatsApp (Ventas)</label>
              <input
                type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange}
                placeholder="Ej: 573001234567"
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Tipografía ── */}
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4">
            Tipografía del Título
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Tamaño de Texto</label>
              <select
                name="heroFontSize"
                value={settings.heroFontSize}
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              >
                {FONT_SIZES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Tipografía</label>
              <select
                name="heroFontFamily"
                value={settings.heroFontFamily}
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              >
                {FONT_FAMILIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vista previa en vivo */}
          <div className="mt-4 p-4 border border-maestro-bone/10 bg-maestro-carbon rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-maestro-bone/40 mb-2">Vista previa</p>
            <p
              style={{
                fontFamily: settings.heroFontFamily === "editorial" ? "'Playfair Display', serif"
                          : settings.heroFontFamily === "modern"    ? "'Inter', sans-serif"
                          : settings.heroFontFamily === "classic"   ? "Georgia, serif"
                          : "'Cormorant Garamond', serif",
                fontSize:   settings.heroFontSize === "small"  ? "1.5rem"
                          : settings.heroFontSize === "medium" ? "2rem"
                          : settings.heroFontSize === "large"  ? "2.5rem"
                          : "3rem",
              }}
              className="text-maestro-bone leading-tight"
            >
              {settings.heroTitle || "DISEÑADO\nPARA MUJERES"}
            </p>
          </div>
        </div>

        {/* ── Imagen y Video ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4">
              Imagen de Portada
            </h2>
            <div className="border border-dashed border-maestro-bone/20 p-6 flex flex-col items-center justify-center text-center">
              {settings.heroImage && (
                <img src={settings.heroImage} alt="Hero actual" className="h-32 object-cover mb-4 rounded-sm border border-maestro-bone/10" />
              )}
              <Upload size={24} className="text-maestro-bone/40 mb-2" />
              <input
                name="heroImage" type="file" accept="image/*"
                className="w-full text-sm text-maestro-bone/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4">
              Video de Portada
            </h2>
            <div className="border border-dashed border-maestro-bone/20 p-6 flex flex-col items-center justify-center text-center">
              {settings.heroVideo && (
                <video src={settings.heroVideo} className="h-32 object-cover mb-4 rounded-sm border border-maestro-bone/10" muted autoPlay loop />
              )}
              <Upload size={24} className="text-maestro-bone/40 mb-2" />
              <input
                name="heroVideo" type="file" accept="video/mp4,video/webm"
                className="w-full text-sm text-maestro-bone/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
              />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-maestro-bone/40 text-center">Si el video está configurado, reemplazará a la imagen en el diseño "Cinematic".</p>

        {/* ── Redes Sociales y Logo ── */}
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4 mt-8">
            Marca y Redes Sociales
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Logo Personalizado (Opcional)</label>
              <div className="border border-dashed border-maestro-bone/20 p-4 flex items-center justify-between">
                <div className="flex-1">
                  <input
                    name="logoFile" type="file" accept="image/png,image/svg+xml"
                    className="w-full text-sm text-maestro-bone/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
                  />
                  <p className="text-[10px] mt-2 text-maestro-bone/40">Si se sube, reemplazará el texto "MAESTRO" en el Footer y Navbar.</p>
                </div>
                {settings.logoUrl && (
                  <div className="ml-4 bg-maestro-carbon p-2 rounded">
                    <img src={settings.logoUrl} alt="Logo" className="h-8 object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Link Instagram</label>
                <input
                  type="url" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange}
                  placeholder="https://instagram.com/maestrodenim"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Link Facebook</label>
                <input
                  type="url" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange}
                  placeholder="https://facebook.com/maestrodenim"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Link TikTok</label>
                <input
                  type="url" name="tiktokUrl" value={settings.tiktokUrl} onChange={handleChange}
                  placeholder="https://tiktok.com/@maestrodenim"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Email de Contacto</label>
                <input
                  type="email" name="mailUrl" value={settings.mailUrl} onChange={handleChange}
                  placeholder="contacto@maestro-denim.com"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Páginas Informativas ── */}
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4 mt-8">
            Páginas Informativas (Footer)
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Nuestra Historia</label>
              <textarea
                name="aboutText" value={settings.aboutText} onChange={handleChange} rows={5}
                placeholder="Escribe la historia de la marca aquí..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Preguntas Frecuentes (FAQ)</label>
              <textarea
                name="faqText" value={settings.faqText} onChange={handleChange} rows={5}
                placeholder="P: ¿Cuánto tarda el envío? R: ..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Términos Legales y Envíos</label>
              <textarea
                name="termsText" value={settings.termsText} onChange={handleChange} rows={5}
                placeholder="Políticas de devolución, envíos, privacidad..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Popup Promocional ── */}
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4 mt-8">
            Popup / Promo Modal
          </h2>

          {/* Toggle activo */}
          <div className="flex items-center justify-between p-4 bg-maestro-carbon border border-maestro-bone/10 mb-6">
            <div>
              <p className="text-sm text-maestro-bone">Activar Popup</p>
              <p className="text-[11px] text-maestro-bone/40 mt-1">Cuando esté activo, aparecerá automáticamente al entrar al sitio.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="popupEnabled"
                checked={settings.popupEnabled}
                onChange={e => setSettings(prev => ({ ...prev, popupEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-maestro-graphite peer-checked:bg-maestro-gold rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="space-y-6">
            {/* Delay */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Demora antes de aparecer (segundos)</label>
              <input
                type="number" name="popupDelay" min="0" max="30"
                value={settings.popupDelay}
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Título del Popup</label>
              <input
                type="text" name="popupTitle" value={settings.popupTitle} onChange={handleChange}
                placeholder="Ej: Nueva Colección 2025"
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Descripción / Mensaje</label>
              <textarea
                name="popupDescription" value={settings.popupDescription} onChange={handleChange} rows={3}
                placeholder="Ej: Descubre las últimas piezas de la temporada. Edición limitada."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Texto del Botón (CTA)</label>
                <input
                  type="text" name="popupLinkText" value={settings.popupLinkText} onChange={handleChange}
                  placeholder="Ej: Ver Colección"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Link del Botón</label>
                <input
                  type="text" name="popupLinkUrl" value={settings.popupLinkUrl} onChange={handleChange}
                  placeholder="Ej: /collections o /category/chaquetas"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
            </div>

            {/* Imagen y Video */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Imagen del Popup</label>
                <div className="border border-dashed border-maestro-bone/20 p-4 flex flex-col items-center text-center">
                  {settings.popupImageUrl && (
                    <img src={settings.popupImageUrl} alt="Popup img" className="h-24 object-cover mb-3 rounded-sm border border-maestro-bone/10" />
                  )}
                  <input
                    name="popupImageFile" type="file" accept="image/*"
                    className="w-full text-xs text-maestro-bone/60 file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
                  />
                  <p className="text-[10px] mt-2 text-maestro-bone/30">Se mostrará si no hay video.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Video del Popup</label>
                <div className="border border-dashed border-maestro-bone/20 p-4 flex flex-col items-center text-center">
                  {settings.popupVideoUrl && (
                    <video src={settings.popupVideoUrl} muted autoPlay loop className="h-24 object-cover mb-3 rounded-sm border border-maestro-bone/10" />
                  )}
                  <input
                    name="popupVideoFile" type="file" accept="video/mp4,video/webm"
                    className="w-full text-xs text-maestro-bone/60 file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
                  />
                  <p className="text-[10px] mt-2 text-maestro-bone/30">El video tiene prioridad sobre la imagen.</p>
                </div>
              </div>
            </div>

            {/* Botón de preview real */}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-3 py-4 border border-maestro-gold/40 text-maestro-gold text-xs uppercase tracking-widest hover:bg-maestro-gold/10 transition-colors"
            >
              <Eye size={14} />
              Previsualizar Popup (sin guardar)
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-maestro-gold text-maestro-dark uppercase tracking-widest text-sm font-semibold hover:bg-maestro-bone transition-colors disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>

      {/* ── Preview Modal cinematográfico (fuera del form) ── */}
      <AnimatePresence>
        {showPreview && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setShowPreview(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 9999,
                backgroundColor: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />

            {/* Wrapper de centrado (sin animación) */}
            <div style={{
              position: "fixed", inset: 0, zIndex: 10000,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px", pointerEvents: "none",
            }}>
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: "all",
                  width: "min(92vw, 540px)",
                  maxHeight: "88vh",
                  overflowY: "auto",
                  backgroundColor: "#060606",
                  border: "1px solid rgba(200,169,107,0.25)",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.6)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Esquinas */}
                {["tl","tr","bl","br"].map(c => (
                  <div key={c} style={{
                    position: "absolute", width: "20px", height: "20px",
                    borderColor: "rgba(200,169,107,0.5)", borderStyle: "solid", zIndex: 10,
                    ...(c==="tl"?{top:12,left:12,borderWidth:"1px 0 0 1px"}:
                        c==="tr"?{top:12,right:12,borderWidth:"1px 1px 0 0"}:
                        c==="bl"?{bottom:12,left:12,borderWidth:"0 0 1px 1px"}:
                                 {bottom:12,right:12,borderWidth:"0 1px 1px 0"}),
                  }}/>
                ))}

                {/* Badge PREVIEW */}
                <div style={{
                  position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "rgba(200,169,107,0.15)", border: "1px solid rgba(200,169,107,0.4)",
                  padding: "3px 14px", zIndex: 20,
                }}>
                  <span style={{ fontSize: "8px", letterSpacing: "0.3em", color: "#C8A96B", textTransform: "uppercase" }}>Vista previa</span>
                </div>

                {/* Cerrar */}
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    position: "absolute", top: 12, right: 12, zIndex: 20,
                    width: 32, height: 32, borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(200,169,107,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#F5F5F5",
                  }}
                >
                  <X size={14} />
                </button>

                {/* Media */}
                {(settings.popupVideoUrl || settings.popupImageUrl) && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    {settings.popupVideoUrl ? (
                      <video src={settings.popupVideoUrl} autoPlay muted loop playsInline
                        style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
                    ) : (
                      <motion.img src={settings.popupImageUrl} alt=""
                        initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                        style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
                    )}
                    <div style={{ position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom, rgba(6,6,6,0.1), rgba(6,6,6,0.5) 70%, rgba(6,6,6,0.95))" }} />
                  </div>
                )}

                {/* Texto */}
                {(settings.popupTitle || settings.popupDescription) && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ padding: "28px 32px 32px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <div style={{ height: 1, width: 28, background: "linear-gradient(to right, #C8A96B, transparent)" }} />
                      <span style={{ fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C8A96B" }}>MAESTRO LUXURY DENIM</span>
                      <div style={{ height: 1, width: 28, background: "linear-gradient(to left, #C8A96B, transparent)" }} />
                    </div>
                    {settings.popupTitle && (
                      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,4vw,2rem)",
                        color: "#FFF", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12, fontWeight: 400 }}>
                        {settings.popupTitle}
                      </h2>
                    )}
                    {settings.popupDescription && (
                      <p style={{ fontSize: 12, color: "rgba(245,245,245,0.55)", lineHeight: 1.75,
                        marginBottom: 24, fontWeight: 300 }}>
                        {settings.popupDescription}
                      </p>
                    )}
                    {settings.popupLinkText && (
                      <div style={{ display: "inline-block", padding: "15px 40px",
                        backgroundColor: "#C8A96B", color: "#050505",
                        fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700 }}>
                        {settings.popupLinkText}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Línea gold */}
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  style={{ height: 1, backgroundColor: "#C8A96B", transformOrigin: "left", opacity: 0.4 }}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
