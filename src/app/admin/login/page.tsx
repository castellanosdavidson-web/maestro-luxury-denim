"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-maestro-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-editorial text-maestro-bone tracking-[0.3em]">MAESTRO</h1>
          <div className="w-8 h-[1px] bg-maestro-gold mx-auto mt-3" />
          <p className="text-maestro-bone/40 text-xs tracking-[0.3em] uppercase mt-3">Panel Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-maestro-carbon border border-maestro-bone/20 p-4 text-sm text-maestro-bone focus:border-maestro-gold outline-none transition-colors"
              placeholder="admin@maestro.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-maestro-carbon border border-maestro-bone/20 p-4 text-sm text-maestro-bone focus:border-maestro-gold outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide border border-red-400/20 bg-red-400/5 p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-maestro-gold text-maestro-dark uppercase tracking-widest text-sm font-semibold hover:bg-maestro-bone transition-colors disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
