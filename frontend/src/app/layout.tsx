import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HairHub - Descubre los mejores servicios cerca de ti",
  description:
    "Reserva citas en barberías, spas, salones de belleza, autolavados y más. Encuentra, compara y agenda servicios en tu ciudad.",
  keywords: [
    "citas",
    "barbería",
    "spa",
    "salón de belleza",
    "reservas",
    "autolavado",
    "manicura",
  ],
  openGraph: {
    title: "HairHub - Reserva servicios de belleza y bienestar",
    description:
      "La plataforma social para descubrir y reservar servicios de belleza, cuidado personal y más.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
