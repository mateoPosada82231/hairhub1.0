"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings, 
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  Plus
} from "lucide-react";
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

// Mock business data
const mockBusiness = {
  name: "Estilo & Glamour",
  category: "Salón de Belleza",
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  rating: 4.9,
  reviews: 189,
  todayAppointments: 8,
  weeklyRevenue: 2450000,
  totalClients: 342,
};

const stats = [
  {
    label: "Citas hoy",
    value: mockBusiness.todayAppointments,
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Ingresos semana",
    value: `$${(mockBusiness.weeklyRevenue / 1000).toFixed(0)}k`,
    icon: DollarSign,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Clientes totales",
    value: mockBusiness.totalClients,
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "Calificación",
    value: mockBusiness.rating,
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
];

const quickActions = [
  { label: "Gestionar citas", icon: Calendar, href: "#" },
  { label: "Ver empleados", icon: Users, href: "#" },
  { label: "Estadísticas", icon: TrendingUp, href: "#" },
  { label: "Configuración", icon: Settings, href: "#" },
];

const todaySchedule = [
  { time: "09:00", client: "María García", service: "Corte y color", status: "completed" },
  { time: "10:30", client: "Ana Rodríguez", service: "Manicure", status: "completed" },
  { time: "12:00", client: "Laura Pérez", service: "Peinado", status: "in-progress" },
  { time: "14:00", client: "Carmen López", service: "Tratamiento capilar", status: "upcoming" },
  { time: "15:30", client: "Sofia Martínez", service: "Corte", status: "upcoming" },
];

export default function MiNegocioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (!isLoading && user && user.role !== "OWNER") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
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
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Mi Negocio
                </h1>
                <p className="text-[#737373]">
                  Gestiona tu negocio y reservas
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-[#e5e5e5] transition-colors flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nueva cita
              </button>
            </motion.div>
          </motion.div>

          {/* Business Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] rounded-2xl border border-[#1a1a1a] overflow-hidden mb-8"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto">
                <img
                  src={mockBusiness.image}
                  alt={mockBusiness.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs font-medium text-[#a3a3a3] mb-3 inline-block">
                      {mockBusiness.category}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {mockBusiness.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{mockBusiness.rating}</span>
                      <span className="text-[#525252]">({mockBusiness.reviews} reseñas)</span>
                    </div>
                  </div>
                  <button className="p-3 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors">
                    <Settings className="h-5 w-5 text-[#a3a3a3]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-[#111111] rounded-xl border border-[#1a1a1a] p-5"
              >
                <div className={`p-3 ${stat.bgColor} rounded-xl w-fit mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-[#737373]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-[#111111] rounded-2xl border border-[#1a1a1a] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Agenda de hoy
                </h3>
                <button className="text-sm text-[#a3a3a3] hover:text-white transition-colors flex items-center gap-1">
                  Ver todo
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      item.status === "in-progress"
                        ? "bg-white/5 border border-white/10"
                        : "bg-[#0a0a0a] hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#737373] w-16">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.client}</p>
                      <p className="text-sm text-[#525252]">{item.service}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "in-progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-[#222222] text-[#a3a3a3]"
                      }`}
                    >
                      {item.status === "completed"
                        ? "Completada"
                        : item.status === "in-progress"
                        ? "En curso"
                        : "Próxima"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111111] rounded-2xl border border-[#1a1a1a] p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">
                Acciones rápidas
              </h3>

              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#222222] transition-colors">
                      <action.icon className="h-5 w-5 text-[#a3a3a3]" />
                    </div>
                    <span className="text-white font-medium">{action.label}</span>
                    <ChevronRight className="h-5 w-5 text-[#404040] ml-auto group-hover:text-[#737373] transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
