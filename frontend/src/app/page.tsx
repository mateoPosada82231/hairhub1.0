"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BusinessCategory,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
} from "@/types";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock featured businesses for display
const featuredBusinesses = [
  {
    id: 1,
    name: "Barbería Elite",
    category: "BARBERSHOP" as BusinessCategory,
    coverImageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
    city: "Medellín",
    averageRating: 4.9,
    totalReviews: 127,
  },
  {
    id: 2,
    name: "Spa Serenity",
    category: "SPA" as BusinessCategory,
    coverImageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    city: "Bogotá",
    averageRating: 4.8,
    totalReviews: 89,
  },
  {
    id: 3,
    name: "Nail Art Studio",
    category: "NAIL_SALON" as BusinessCategory,
    coverImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    city: "Cali",
    averageRating: 4.7,
    totalReviews: 64,
  },
];

const categories: BusinessCategory[] = [
  "BARBERSHOP",
  "HAIR_SALON",
  "NAIL_SALON",
  "SPA",
  "CAR_WASH",
  "PET_GROOMING",
  "TATTOO_STUDIO",
  "OTHER",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] via-[var(--primary-500)] to-[var(--accent-500)] opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Logo/Brand */}
            <motion.div variants={fadeIn} className="mb-6">
              <span className="text-5xl">💈</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeIn}
              className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Descubre los mejores{" "}
              <span className="text-[var(--accent-200)]">servicios</span>
              <br />
              cerca de ti
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeIn}
              className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl"
            >
              Reserva citas en barberías, spas, salones de belleza y más.
              Todo en un solo lugar.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeIn}
              className="mx-auto max-w-2xl"
            >
              <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-lg sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    placeholder="¿Qué servicio estás buscando?"
                    className="h-14 w-full rounded-xl bg-white/10 pl-12 pr-4 text-white placeholder:text-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div className="relative flex-1 sm:max-w-[200px]">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    className="h-14 w-full rounded-xl bg-white/10 pl-12 pr-4 text-white placeholder:text-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <Button
                  size="lg"
                  variant="accent"
                  className="h-14 px-8 text-base font-bold"
                >
                  Buscar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="mb-2 text-center text-3xl font-bold"
            >
              Explora por categoría
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="mb-10 text-center text-[var(--foreground-muted)]"
            >
              Encuentra el servicio perfecto para ti
            </motion.p>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8"
            >
              {categories.map((category) => (
                <motion.div key={category} variants={fadeIn}>
                  <Card
                    hover
                    className="group flex flex-col items-center p-4 text-center"
                  >
                    <span className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
                      {CATEGORY_ICONS[category]}
                    </span>
                    <span className="text-sm font-medium leading-tight">
                      {CATEGORY_LABELS[category]}
                    </span>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="bg-[var(--background-secondary)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="mb-10 flex items-center justify-between">
              <div>
                <motion.h2
                  variants={fadeIn}
                  className="text-3xl font-bold"
                >
                  Destacados
                </motion.h2>
                <motion.p
                  variants={fadeIn}
                  className="text-[var(--foreground-muted)]"
                >
                  Los negocios mejor valorados de la comunidad
                </motion.p>
              </div>
              <motion.div variants={fadeIn}>
                <Button variant="ghost" className="group">
                  Ver todos
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featuredBusinesses.map((business) => (
                <motion.div key={business.id} variants={fadeIn}>
                  <Card hover className="overflow-hidden p-0">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={business.coverImageUrl}
                        alt={business.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Category Badge */}
                      <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                          {CATEGORY_ICONS[business.category]}
                          {CATEGORY_LABELS[business.category]}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="mb-1 text-xl font-bold">{business.name}</h3>
                      <div className="mb-3 flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                        <MapPin className="h-4 w-4" />
                        {business.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{business.averageRating}</span>
                        <span className="text-[var(--foreground-muted)]">
                          ({business.totalReviews} reseñas)
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="mb-4 text-3xl font-bold sm:text-4xl"
            >
              ¿Tienes un negocio?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="mb-8 text-lg text-[var(--foreground-muted)]"
            >
              Únete a HairHub y llega a miles de clientes potenciales.
              Gestiona tus citas, trabajadores y estadísticas en un solo lugar.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" className="text-base">
                Registrar mi negocio
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Saber más
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💈</span>
              <span className="text-xl font-bold text-gradient">HairHub</span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              © 2026 HairHub. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
