"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Loader2, RefreshCw, AlertCircle, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EstablishmentCard } from "@/components/EstablishmentCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { BusinessSummary } from "@/types";
import "@/styles/home.css";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function FavoritosContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<BusinessSummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getAllMyFavorites();
      setFavorites(data);
      setFavoriteIds(new Set(data.map(b => b.id)));
    } catch (err: any) {
      setError(err.message || "Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  const handleToggleFavorite = async (businessId: number) => {
    try {
      await api.removeFavorite(businessId);
      setFavorites(prev => prev.filter(b => b.id !== businessId));
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(businessId);
        return newSet;
      });
    } catch (err: any) {
      setError(err.message || "Error al eliminar de favoritos");
    }
  };

  const handleViewDetails = (businessId: number) => {
    router.push(`/negocio/${businessId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-red-500/10">
                  <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
              </div>
              <p className="text-[#737373]">
                {favorites.length} {favorites.length === 1 ? "lugar guardado" : "lugares guardados"}
              </p>
            </div>
            <button
              onClick={loadFavorites}
              disabled={loading}
              className="p-3 rounded-xl bg-[#111111] border border-[#222222] text-[#737373] hover:text-white hover:border-[#333333] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {/* Favorites Grid */}
          {!loading && favorites.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="establishments-grid"
            >
              {favorites.map((business) => (
                <motion.div key={business.id} variants={fadeIn}>
                  <EstablishmentCard
                    business={business}
                    isFavorite={favoriteIds.has(business.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && favorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#111111] flex items-center justify-center border border-[#222222]">
                <Heart className="h-12 w-12 text-[#333333]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tienes favoritos guardados
              </h3>
              <p className="text-[#737373] mb-6 max-w-md mx-auto">
                Explora los establecimientos y guarda tus favoritos tocando el corazón para encontrarlos fácilmente después
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

export default function FavoritosPage() {
  return (
    <ProtectedRoute>
      <FavoritosContent />
    </ProtectedRoute>
  );
}
