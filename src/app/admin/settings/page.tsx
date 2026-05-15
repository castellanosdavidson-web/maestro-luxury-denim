"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

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
    // Asegurarse de que los selects quedan incluidos en el FormData
    formData.set("heroFontSize",   settings.heroFontSize);
    formData.set("heroFontFamily", settings.heroFontFamily);

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

            {/* Preview */}
            {(settings.popupTitle || settings.popupImageUrl) && (
              <div className="border border-maestro-gold/20 p-4 bg-maestro-carbon rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-maestro-bone/40 mb-3">Vista previa del Popup</p>
                <div className="bg-[#0a0a0a] border border-maestro-gold/30 p-6 max-w-xs">
                  {settings.popupImageUrl && !settings.popupVideoUrl && (
                    <img src={settings.popupImageUrl} alt="" className="w-full h-32 object-cover mb-4" />
                  )}
                  {settings.popupTitle && (
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#FFF" }}>{settings.popupTitle}</p>
                  )}
                  {settings.popupDescription && (
                    <p className="text-xs text-maestro-bone/50 mt-2">{settings.popupDescription}</p>
                  )}
                  {settings.popupLinkText && (
                    <div className="mt-4 inline-block px-6 py-2 bg-maestro-gold text-maestro-dark text-[9px] uppercase tracking-widest">
                      {settings.popupLinkText}
                    </div>
                  )}
                </div>
              </div>
            )}
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
    </div>
  );
}
