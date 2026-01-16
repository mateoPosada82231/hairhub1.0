import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/lib/toast";

export const metadata: Metadata = {
  title: "BookHub - Reserva en tus lugares favoritos",
  description:
    "Reserva citas en restaurantes, salones de belleza, gimnasios, spas, cafeterías y más. Encuentra, compara y agenda servicios en tu ciudad.",
  keywords: [
    "reservas",
    "citas",
    "restaurantes",
    "spa",
    "salón de belleza",
    "gimnasio",
    "cafetería",
  ],
  openGraph: {
    title: "BookHub - Reserva en tus lugares favoritos",
    description:
      "La plataforma para descubrir y reservar en tus establecimientos favoritos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" data-scroll-behavior="smooth">
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
