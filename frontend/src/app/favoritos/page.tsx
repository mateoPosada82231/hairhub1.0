"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock de favoritos
const mockFavorites = [
  {
    id: 1,
    name: "La Casa del Chef",
    category: "Restaurante",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Centro, Medellín",
    rating: 4.8,
    reviews: 234,
    priceRange: "$$",
  },
  {
    id: 2,
    name: "Estilo & Glamour",
    category: "Salón de Belleza",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    location: "El Poblado, Medellín",
    rating: 4.9,
    reviews: 189,
    priceRange: "$$$",
  },
  {
    id: 4,
    name: "Zen Spa & Wellness",
    category: "Spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    location: "Envigado",
    rating: 4.9,
    reviews: 312,
    priceRange: "$$$",
  },
  {
    id: 5,
    name: "Café del Parque",
    category: "Cafetería",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    location: "Provenza, Medellín",
    rating: 4.6,
    reviews: 178,
    priceRange: "$",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function FavoritosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState(mockFavorites);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.h1
              variants={fadeIn}
              className="text-3xl font-bold text-white mb-2"
            >
              Mis Favoritos
            </motion.h1>
            <motion.p variants={fadeIn} className="text-[#737373]">
              {favorites.length} lugares guardados
            </motion.p>
          </motion.div>

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  variants={fadeIn}
                  className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-red-500/80 transition-colors group/btn"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500 group-hover/btn:hidden" />
                      <Trash2 className="h-5 w-5 text-white hidden group-hover/btn:block" />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                        {fav.category}
                      </span>
                    </div>

                    {/* Price Range */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                        {fav.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#d4d4d4] transition-colors">
                        {fav.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium">{fav.rating}</span>
                        <span className="text-[#525252]">({fav.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#737373] text-sm mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{fav.location}</span>
                    </div>

                    <button className="w-full py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white font-medium hover:bg-[#222222] hover:border-[#333333] transition-colors">
                      Ver disponibilidad
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tienes favoritos aún
              </h3>
              <p className="text-[#737373] mb-6">
                Explora los mejores lugares y guarda tus favoritos para encontrarlos fácilmente
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-[#e5e5e5] transition-colors"
              >
                Explorar lugares
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
