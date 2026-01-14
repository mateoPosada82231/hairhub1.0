import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
