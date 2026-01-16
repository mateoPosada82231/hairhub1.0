"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicOnlyRoute } from "@/components/ProtectedRoute";
import { notify } from "@/components/ui/toast";
import "@/styles/auth.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

function RecoverPasswordContent() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devResetLink, setDevResetLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    setDevResetLink(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if we're in dev mode and got a reset link
        if (data.devResetLink) {
          setDevResetLink(data.devResetLink);
          setSuccess("Modo desarrollo: usa el enlace de abajo para restablecer tu contraseña");
          notify.success("Enlace de recuperación generado");
        } else {
          const successMessage = "Se ha enviado un enlace de recuperación a tu correo electrónico";
          setSuccess(successMessage);
          notify.success(successMessage);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } else if (response.status === 429) {
        const errorMessage = "Demasiadas solicitudes. Por favor, espera un momento.";
        setError(errorMessage);
        notify.error(errorMessage);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Error al procesar la solicitud";
        setError(errorMessage);
        notify.error(errorMessage);
      }
    } catch {
      const errorMessage = "Error de conexión. Por favor, intenta de nuevo.";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (devResetLink) {
      navigator.clipboard.writeText(devResetLink);
      notify.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="recover-password-container">
        <div className="logo">
          <h1>BOOKHUB</h1>
        </div>
        <h2 className="recover-password-title">Recuperar Contraseña</h2>

        <div className="alert alert-info text-center mb-4">
          Ingresa tu correo electrónico para recibir un enlace de recuperación
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          {/* Dev mode: show the reset link */}
          {devResetLink && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium mb-2">
                🔧 Modo Desarrollo - Enlace de recuperación:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={devResetLink}
                  readOnly
                  className="flex-1 text-xs bg-black/30 border border-yellow-600/50 rounded px-2 py-1 text-yellow-200"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                >
                  Copiar
                </button>
              </div>
              <a
                href={devResetLink}
                className="block mt-2 text-center text-yellow-400 hover:text-yellow-300 text-sm underline"
              >
                O haz clic aquí para ir directamente
              </a>
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar enlace"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <Link href="/login" className="recover-password-link">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecoverPasswordPage() {
  return (
    <PublicOnlyRoute>
      <RecoverPasswordContent />
    </PublicOnlyRoute>
  );
}
