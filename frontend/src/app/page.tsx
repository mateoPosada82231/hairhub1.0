"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Heart, Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";

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
      staggerChildren: 0.08,
    },
  },
};

// Categorías disponibles
const categories = [
  { id: "all", label: "Todos", icon: "🔍" },
  { id: "restaurant", label: "Restaurantes", icon: "🍽️" },
  { id: "salon", label: "Salones de Belleza", icon: "💇" },
  { id: "gym", label: "Gimnasios", icon: "🏋️" },
  { id: "spa", label: "Spas", icon: "🧖" },
  { id: "cafe", label: "Cafeterías", icon: "☕" },
  { id: "bar", label: "Bares", icon: "🍸" },
];

// Mock de establecimientos
const establishments = [
  {
    id: 1,
    name: "La Casa del Chef",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Centro, Medellín",
    rating: 4.8,
    reviews: 234,
    priceRange: "$$",
    openNow: true,
    distance: "0.8 km",
  },
  {
    id: 2,
    name: "Estilo & Glamour",
    category: "salon",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    location: "El Poblado, Medellín",
    rating: 4.9,
    reviews: 189,
    priceRange: "$$$",
    openNow: true,
    distance: "1.2 km",
  },
  {
    id: 3,
    name: "FitLife Gym",
    category: "gym",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    location: "Laureles, Medellín",
    rating: 4.7,
    reviews: 456,
    priceRange: "$$",
    openNow: false,
    distance: "2.1 km",
  },
  {
    id: 4,
    name: "Zen Spa & Wellness",
    category: "spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    location: "Envigado",
    rating: 4.9,
    reviews: 312,
    priceRange: "$$$",
    openNow: true,
    distance: "3.5 km",
  },
  {
    id: 5,
    name: "Café del Parque",
    category: "cafe",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    location: "Provenza, Medellín",
    rating: 4.6,
    reviews: 178,
    priceRange: "$",
    openNow: true,
    distance: "0.5 km",
  },
  {
    id: 6,
    name: "The Rooftop Bar",
    category: "bar",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
    location: "El Poblado, Medellín",
    rating: 4.5,
    reviews: 267,
    priceRange: "$$$",
    openNow: false,
    distance: "1.8 km",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredEstablishments = establishments.filter((est) => {
    const matchesCategory = selectedCategory === "all" || est.category === selectedCategory;
    const matchesSearch = est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          est.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero / Search Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-10"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Encuentra y reserva los mejores{" "}
              <span className="text-[#a3a3a3]">lugares</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-[#737373] text-lg max-w-2xl mx-auto"
            >
              Restaurantes, spas, gimnasios, salones de belleza y más. Todo en un solo lugar.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                />
              </div>
              <div className="relative flex-1 sm:max-w-[200px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                <input
                  type="text"
                  placeholder="Ubicación"
                  className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                />
              </div>
              <button className="h-12 px-8 bg-white text-black font-semibold rounded-xl hover:bg-[#e5e5e5] transition-colors flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Buscar
              </button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-white text-black font-semibold"
                    : "bg-[#111111] text-[#a3a3a3] border border-[#222222] hover:border-[#404040] hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#737373]">
              <span className="text-white font-semibold">{filteredEstablishments.length}</span> lugares encontrados
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#222222] rounded-lg text-[#a3a3a3] hover:border-[#404040] hover:text-white transition-colors">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>

          {/* Establishments Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEstablishments.map((est) => (
              <motion.div
                key={est.id}
                variants={fadeIn}
                className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={est.image}
                    alt={est.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(est.id)}
                    className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        favorites.includes(est.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </button>

                  {/* Open Status */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        est.openNow
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {est.openNow ? "Abierto" : "Cerrado"}
                    </span>
                  </div>

                  {/* Price Range */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {est.priceRange}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#d4d4d4] transition-colors">
                      {est.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{est.rating}</span>
                      <span className="text-[#525252]">({est.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#737373] text-sm mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{est.location}</span>
                    <span className="text-[#404040]">•</span>
                    <span>{est.distance}</span>
                  </div>

                  <button className="w-full py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white font-medium hover:bg-[#222222] hover:border-[#333333] transition-colors">
                    Ver disponibilidad
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredEstablishments.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No encontramos resultados
              </h3>
              <p className="text-[#737373]">
                Intenta con otra búsqueda o cambia los filtros
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-xl font-bold text-white">BookHub</span>
            </div>
            <p className="text-sm text-[#525252]">
              © 2026 BookHub. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
