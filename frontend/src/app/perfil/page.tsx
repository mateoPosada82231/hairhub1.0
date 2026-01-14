"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, LogOut, ChevronRight, Bell, Shield, CreditCard } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const menuItems = [
  {
    icon: Bell,
    label: "Notificaciones",
    description: "Configura tus alertas y recordatorios",
  },
  {
    icon: Shield,
    label: "Privacidad y seguridad",
    description: "Contraseña, verificación en dos pasos",
  },
  {
    icon: CreditCard,
    label: "Métodos de pago",
    description: "Gestiona tus tarjetas y pagos",
  },
];

export default function PerfilPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
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
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div
              variants={fadeIn}
              className="bg-[#111111] rounded-2xl border border-[#1a1a1a] p-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-[#2a2a2a]">
                    <User className="h-12 w-12 text-[#525252]" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full hover:bg-[#e5e5e5] transition-colors">
                    <Camera className="h-4 w-4 text-black" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {user.fullName || "Usuario"}
                  </h1>
                  <p className="text-[#737373] mb-3">{user.email}</p>
                  <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs font-medium text-[#a3a3a3]">
                    {user.role === "OWNER" ? "Propietario" : "Cliente"}
                  </span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-white text-black rounded-xl font-medium hover:bg-[#e5e5e5] transition-colors"
                >
                  {isEditing ? "Guardar" : "Editar perfil"}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] rounded-2xl border border-[#1a1a1a] p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Información personal
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                    <input
                      type="text"
                      defaultValue={user.fullName || ""}
                      className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                    <input
                      type="tel"
                      placeholder="Agregar teléfono"
                      className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">
                    Ubicación
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                    <input
                      type="text"
                      placeholder="Agregar ubicación"
                      className="w-full h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 text-white placeholder:text-[#525252] focus:outline-none focus:border-[#404040] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3 mb-8"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                variants={fadeIn}
                className="w-full bg-[#111111] rounded-xl border border-[#1a1a1a] p-4 flex items-center gap-4 hover:border-[#2a2a2a] transition-all group"
              >
                <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#222222] transition-colors">
                  <item.icon className="h-5 w-5 text-[#a3a3a3]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium">{item.label}</h3>
                  <p className="text-sm text-[#525252]">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#404040] group-hover:text-[#737373] transition-colors" />
              </motion.button>
            ))}
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleLogout}
              className="w-full bg-[#111111] rounded-xl border border-red-500/20 p-4 flex items-center gap-4 hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
            >
              <div className="p-3 bg-red-500/10 rounded-xl">
                <LogOut className="h-5 w-5 text-red-400" />
              </div>
              <span className="text-red-400 font-medium">Cerrar sesión</span>
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
