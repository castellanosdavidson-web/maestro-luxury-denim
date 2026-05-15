"use client";

import { useState, useEffect } from "react";
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
  popupDelay:       number; // segundos antes de mostrar
}

const SESSION_KEY = "maestro_popup_seen";

export default function PromoPopup() {
  const [settings, setSettings]   = useState<PopupSettings | null>(null);
  const [visible,  setVisible]    = useState(false);
  const [closing,  setClosing]    = useState(false);

  useEffect(() => {
    // No mostrar si ya se vio en esta sesión
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
          popupLinkText:    data.popupLinkText    || "Ver ahora",
          popupDelay:       Number(data.popupDelay ?? 1),
        });

        // Mostrar después del delay configurado
        const delay = Math.max(0, Number(data.popupDelay ?? 1)) * 1000;
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    setClosing(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    setTimeout(() => { setVisible(false); setClosing(false); }, 400);
  };

  if (!settings || !visible) return null;

  const hasMedia = settings.popupVideoUrl || settings.popupImageUrl;

  return (
    <AnimatePresence>
      {!closing && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.75)",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              width: "min(90vw, 580px)",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(200,169,107,0.3)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,107,0.1)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.1)",
                border: "none", borderRadius: "50%",
                width: "36px", height: "36px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#F5F5F5",
                zIndex: 2, transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,169,107,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              <X size={18} />
            </button>

            {/* Media: video o imagen */}
            {settings.popupVideoUrl ? (
              <video
                src={settings.popupVideoUrl}
                autoPlay muted loop playsInline
                style={{ width: "100%", display: "block", maxHeight: "340px", objectFit: "cover" }}
              />
            ) : settings.popupImageUrl ? (
              <img
                src={settings.popupImageUrl}
                alt={settings.popupTitle}
                style={{ width: "100%", display: "block", maxHeight: "340px", objectFit: "cover" }}
              />
            ) : null}

            {/* Contenido de texto */}
            {(settings.popupTitle || settings.popupDescription || settings.popupLinkUrl) && (
              <div style={{ padding: hasMedia ? "32px" : "48px 32px 40px" }}>
                {/* Gold accent */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ height: "1px", width: "24px", backgroundColor: "#C8A96B" }} />
                  <span style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C8A96B" }}>
                    MAESTRO
                  </span>
                </div>

                {settings.popupTitle && (
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                    marginBottom: "16px",
                  }}>
                    {settings.popupTitle}
                  </h2>
                )}

                {settings.popupDescription && (
                  <p style={{
                    fontSize: "13px",
                    color: "rgba(245,245,245,0.6)",
                    lineHeight: 1.7,
                    marginBottom: "28px",
                    fontWeight: 300,
                  }}>
                    {settings.popupDescription}
                  </p>
                )}

                {settings.popupLinkUrl && (
                  <Link
                    href={settings.popupLinkUrl}
                    onClick={handleClose}
                    style={{
                      display: "inline-block",
                      padding: "16px 40px",
                      backgroundColor: "#C8A96B",
                      color: "#050505",
                      fontSize: "10px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.backgroundColor = "#F5F5F5")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.backgroundColor = "#C8A96B")}
                  >
                    {settings.popupLinkText}
                  </Link>
                )}

                {/* No mostrar de nuevo */}
                <p
                  onClick={handleClose}
                  style={{
                    marginTop: "20px", fontSize: "10px", color: "rgba(245,245,245,0.25)",
                    cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px",
                  }}
                >
                  No mostrar de nuevo
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
