"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

interface PopupSettings {
  popupEnabled:     boolean;
  popupImageUrl:    string;
  popupVideoUrl:    string;
  popupTitle:       string;
  popupDescription: string;
  popupLinkUrl:     string;
  popupLinkText:    string;
  popupDelay:       number;
}

const SESSION_KEY = "maestro_popup_seen_v2";

export default function PromoPopup() {
  const [settings, setSettings] = useState<PopupSettings | null>(null);
  const [visible,  setVisible]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch("/api/settings")
      .then(r => r.json())
      .then((data: any) => {
        if (!data.popupEnabled) return;
        setSettings({
          popupEnabled:     data.popupEnabled,
          popupImageUrl:    data.popupImageUrl    || "",
          popupVideoUrl:    data.popupVideoUrl    || "",
          popupTitle:       data.popupTitle       || "",
          popupDescription: data.popupDescription || "",
          popupLinkUrl:     data.popupLinkUrl     || "",
          popupLinkText:    data.popupLinkText    || "Descubrir",
          popupDelay:       Math.max(0, Number(data.popupDelay ?? 1)),
        });
        timerRef.current = setTimeout(() => setVisible(true), Math.max(0, Number(data.popupDelay ?? 1)) * 1000);
      })
      .catch(() => {});

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  if (!settings) return null;

  const hasVideo = Boolean(settings.popupVideoUrl);
  const hasImage = Boolean(settings.popupImageUrl);
  const hasMedia = hasVideo || hasImage;
  const hasText  = settings.popupTitle || settings.popupDescription;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={close}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.82)",
              zIndex: 1000,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* ── Centering wrapper (NO animation here) ── */}
          <div
            style={{
              position: "fixed", inset: 0,
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              pointerEvents: "none",
            }}
          >
            {/* ── Modal animado ── */}
            <motion.div
              key="popup-modal"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: "all",
                width: "min(92vw, 540px)",
                maxHeight: "88vh",
                overflowY: "auto",
                backgroundColor: "#060606",
                border: "1px solid rgba(200, 169, 107, 0.25)",
                boxShadow: `
                  0 0 0 1px rgba(200,169,107,0.08),
                  0 40px 100px rgba(0,0,0,0.9),
                  0 8px 32px rgba(0,0,0,0.6),
                  inset 0 1px 0 rgba(255,255,255,0.04)
                `,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* ── Esquinas decorativas ── */}
              {["tl","tr","bl","br"].map(corner => (
                <div key={corner} style={{
                  position: "absolute", width: "20px", height: "20px",
                  borderColor: "rgba(200,169,107,0.5)", borderStyle: "solid",
                  zIndex: 10,
                  ...(corner === "tl" ? { top: 12, left: 12, borderWidth: "1px 0 0 1px" } :
                      corner === "tr" ? { top: 12, right: 12, borderWidth: "1px 1px 0 0" } :
                      corner === "bl" ? { bottom: 12, left: 12, borderWidth: "0 0 1px 1px" } :
                                        { bottom: 12, right: 12, borderWidth: "0 1px 1px 0" }),
                }} />
              ))}

              {/* ── Botón cerrar ── */}
              <button
                onClick={close}
                style={{
                  position: "absolute", top: "16px", right: "16px",
                  width: "36px", height: "36px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(200,169,107,0.3)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#F5F5F5",
                  zIndex: 20, transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(200,169,107,0.2)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#C8A96B";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,169,107,0.3)";
                }}
              >
                <X size={15} />
              </button>

              {/* ── Zona de media con overlay editorial ── */}
              {hasMedia && (
                <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                  {/* Ken Burns en imagen */}
                  {hasVideo ? (
                    <video
                      src={settings.popupVideoUrl}
                      autoPlay muted loop playsInline
                      style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <motion.img
                      src={settings.popupImageUrl}
                      alt={settings.popupTitle}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 6, ease: "linear" }}
                      style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
                    />
                  )}

                  {/* Gradiente dramático sobre la imagen */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(6,6,6,0.15) 0%, rgba(6,6,6,0.55) 70%, rgba(6,6,6,0.95) 100%)",
                  }} />

                  {/* Franjas Letterbox cinematográficas */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "40px",
                    background: "linear-gradient(to bottom, #060606, transparent)",
                  }} />

                  {/* Texto sobre la imagen si no hay panel de texto separado */}
                  {!hasText && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "24px 28px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ height: "1px", width: "20px", backgroundColor: "#C8A96B" }} />
                        <span style={{ fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C8A96B" }}>MAESTRO</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Panel de texto ── */}
              {hasText && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: hasMedia ? "28px 32px 32px" : "48px 32px 40px" }}
                >
                  {/* Eyebrow */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, #C8A96B, transparent)", maxWidth: "40px" }} />
                    <span style={{ fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C8A96B" }}>
                      MAESTRO LUXURY DENIM
                    </span>
                    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, #C8A96B, transparent)", maxWidth: "40px" }} />
                  </div>

                  {settings.popupTitle && (
                    <h2 style={{
                      fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                      fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
                      color: "#FFFFFF",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      marginBottom: "14px",
                      fontWeight: 400,
                    }}>
                      {settings.popupTitle}
                    </h2>
                  )}

                  {settings.popupDescription && (
                    <p style={{
                      fontSize: "12px",
                      color: "rgba(245,245,245,0.55)",
                      lineHeight: 1.75,
                      marginBottom: "28px",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                    }}>
                      {settings.popupDescription}
                    </p>
                  )}

                  {settings.popupLinkUrl && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "14px" }}>
                      <Link
                        href={settings.popupLinkUrl}
                        onClick={close}
                        style={{
                          display: "inline-block",
                          padding: "15px 44px",
                          backgroundColor: "#C8A96B",
                          color: "#050505",
                          fontSize: "9px",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {settings.popupLinkText}
                      </Link>

                      <button
                        onClick={close}
                        style={{
                          background: "none", border: "none",
                          fontSize: "9px", letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: "rgba(245,245,245,0.25)",
                          cursor: "pointer",
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                          padding: 0,
                        }}
                      >
                        No mostrar de nuevo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Si solo hay media sin texto, muestra el CTA sobre la imagen */}
              {!hasText && settings.popupLinkUrl && hasMedia && (
                <div style={{ padding: "20px 28px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link
                    href={settings.popupLinkUrl}
                    onClick={close}
                    style={{
                      padding: "14px 36px",
                      backgroundColor: "#C8A96B",
                      color: "#050505",
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {settings.popupLinkText || "Descubrir"}
                  </Link>
                  <button onClick={close} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "9px", letterSpacing: "0.2em",
                    textTransform: "uppercase", color: "rgba(245,245,245,0.25)",
                    textDecoration: "underline", textUnderlineOffset: "4px",
                  }}>
                    Cerrar
                  </button>
                </div>
              )}

              {/* Línea gold inferior */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "1px", backgroundColor: "#C8A96B",
                  transformOrigin: "left",
                  opacity: 0.5,
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
