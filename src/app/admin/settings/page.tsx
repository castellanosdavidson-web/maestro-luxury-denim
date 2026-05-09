"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroCaption: "",
    heroValueProp: "",
    heroImage: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => setSettings(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });
      alert("Textos e imagen actualizados correctamente");
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      alert("Error al actualizar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl text-editorial text-maestro-bone mb-8">Configuración de Portada</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-maestro-dark border border-maestro-bone/10 p-8 rounded-sm">
        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4">Textos Principales</h2>
          
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
                type="text" 
                name="heroSubtitle" 
                value={settings.heroSubtitle} 
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Caption Superior</label>
              <input 
                type="text" 
                name="heroCaption" 
                value={settings.heroCaption} 
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Propuesta de Valor</label>
              <input 
                type="text" 
                name="heroValueProp" 
                value={settings.heroValueProp} 
                onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg text-maestro-gold tracking-widest uppercase mb-6 border-b border-maestro-bone/10 pb-4 mt-8">Imagen de Portada</h2>
          <div className="border border-dashed border-maestro-bone/20 p-6 flex flex-col items-center justify-center text-center">
            {settings.heroImage && (
              <img src={settings.heroImage} alt="Hero actual" className="h-32 object-cover mb-4 rounded-sm border border-maestro-bone/10" />
            )}
            <Upload size={24} className="text-maestro-bone/40 mb-2" />
            <input name="heroImage" type="file" accept="image/*" className="text-sm text-maestro-bone/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold" />
            <p className="text-[10px] text-maestro-bone/40 mt-3">Si no subes nada, se mantendrá la imagen actual.</p>
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
