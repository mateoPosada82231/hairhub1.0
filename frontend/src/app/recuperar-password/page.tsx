"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicOnlyRoute } from "@/components/ProtectedRoute";
import "@/styles/auth.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

function RecoverPasswordContent() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess("Se ha enviado un enlace de recuperación a tu correo electrónico");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else if (response.status === 404 || response.status === 500) {
        // Endpoint no implementado todavía
        setError("Esta funcionalidad estará disponible próximamente");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Error al procesar la solicitud");
      }
    } catch {
      // Si hay error de conexión o el endpoint no existe
      setError("Esta funcionalidad estará disponible próximamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d0c] flex items-center justify-center px-4">
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
