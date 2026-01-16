import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="es" className={`dark ${inter.variable}`} data-scroll-behavior="smooth">
      <body className={`antialiased ${inter.className}`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
