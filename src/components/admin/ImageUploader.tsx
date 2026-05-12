"use client";

import { useRef, useState } from "react";
import { Upload, ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, X, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  /** El src actual de la imagen (URL o blob) */
  currentUrl?: string;
  /** Posición X guardada (0-100) */
  initialX?: number;
  /** Posición Y guardada (0-100) */
  initialY?: number;
  /** Zoom guardado (100-200) */
  initialZoom?: number;
  /** Label del campo */
  label?: string;
  /** Aspecto del preview, ej: "3/4", "16/9", "1/1" */
  aspect?: string;
  /** Hint de recomendación de tamaño */
  hint?: string;
  /** name del input hidden para el file */
  fieldName?: string;
  /** names de los inputs hidden para focal X/Y/Zoom */
  focalXName?: string;
  focalYName?: string;
  zoomName?: string;
  /** onChange callback con file + position */
  onChange?: (file: File | null, x: number, y: number, zoom: number) => void;
}

export default function ImageUploader({
  currentUrl,
  initialX = 50,
  initialY = 50,
  initialZoom = 100,
  label = "Imagen",
  aspect = "3/4",
  hint,
  fieldName = "image",
  focalXName,
  focalYName,
  zoomName,
  onChange,
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [file, setFile]       = useState<File | null>(null);
  const [x, setX]             = useState(initialX);
  const [y, setY]             = useState(initialY);
  const [zoom, setZoom]       = useState(initialZoom);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onChange?.(f, x, y, zoom);
  };

  const handleX = (v: number) => { setX(v); onChange?.(file, v, y, zoom); };
  const handleY = (v: number) => { setY(v); onChange?.(file, x, v, zoom); };
  const handleZoom = (v: number) => { setZoom(v); onChange?.(file, x, y, v); };

  const clearImage = () => {
    setPreview("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    onChange?.(null, x, y, zoom);
  };

  const objectPosition = `${x}% ${y}%`;
  const scale = zoom / 100;

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">{label}</p>
      )}

      {/* Preview box */}
      <div
        className="relative overflow-hidden bg-white/5 border border-white/10 w-full cursor-pointer group"
        style={{ aspectRatio: aspect }}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
              style={{
                objectPosition,
                transform: `scale(${scale})`,
                transformOrigin: `${x}% ${y}%`,
              }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs tracking-widest uppercase flex items-center gap-2">
                <Upload size={13} /> Cambiar
              </span>
            </div>
            {/* Clear button */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); clearImage(); }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-2">
            <ImageIcon size={28} />
            <p className="text-[10px] tracking-widest uppercase">Clic para seleccionar</p>
            {hint && <p className="text-[9px] text-white/15">{hint}</p>}
          </div>
        )}
      </div>

      {/* Hidden inputs for form submission */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        name={fieldName}
        className="hidden"
        onChange={handleFile}
      />
      {focalXName && <input type="hidden" name={focalXName} value={x} />}
      {focalYName && <input type="hidden" name={focalYName} value={y} />}
      {zoomName   && <input type="hidden" name={zoomName}   value={zoom} />}

      {/* Controls — only show if there's a preview */}
      {preview && (
        <div className="space-y-2.5 bg-white/3 border border-white/5 p-3">
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-2">Ajustar posición</p>

          {/* X */}
          <div className="flex items-center gap-3">
            <MoveHorizontal size={11} className="text-white/30 flex-shrink-0" />
            <input
              type="range" min={0} max={100} step={1} value={x}
              onChange={e => handleX(Number(e.target.value))}
              className="flex-1 h-0.5 accent-[#C9A96E] cursor-pointer"
            />
            <span className="text-[9px] text-white/30 w-8 text-right">{x}%</span>
          </div>

          {/* Y */}
          <div className="flex items-center gap-3">
            <MoveVertical size={11} className="text-white/30 flex-shrink-0" />
            <input
              type="range" min={0} max={100} step={1} value={y}
              onChange={e => handleY(Number(e.target.value))}
              className="flex-1 h-0.5 accent-[#C9A96E] cursor-pointer"
            />
            <span className="text-[9px] text-white/30 w-8 text-right">{y}%</span>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomOut size={11} className="text-white/30 flex-shrink-0" />
            <input
              type="range" min={100} max={200} step={1} value={zoom}
              onChange={e => handleZoom(Number(e.target.value))}
              className="flex-1 h-0.5 accent-[#C9A96E] cursor-pointer"
            />
            <ZoomIn size={11} className="text-white/30 flex-shrink-0" />
            <span className="text-[9px] text-white/30 w-8 text-right">{zoom}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
