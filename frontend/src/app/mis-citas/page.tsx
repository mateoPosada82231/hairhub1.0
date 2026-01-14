"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock de citas
const mockAppointments = [
  {
    id: 1,
    businessName: "Estilo & Glamour",
    serviceName: "Corte de cabello",
    date: "2026-01-15",
    time: "10:00",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    address: "El Poblado, Medellín",
    price: 45000,
  },
  {
    id: 2,
    businessName: "Zen Spa & Wellness",
    serviceName: "Masaje relajante",
    date: "2026-01-18",
    time: "15:30",
    status: "pending",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    address: "Envigado",
    price: 120000,
  },
  {
    id: 3,
    businessName: "La Casa del Chef",
    serviceName: "Reserva mesa para 4",
    date: "2026-01-20",
    time: "20:00",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    address: "Centro, Medellín",
    price: 0,
  },
];

const pastAppointments = [
  {
    id: 4,
    businessName: "FitLife Gym",
    serviceName: "Clase de spinning",
    date: "2026-01-05",
    time: "07:00",
    status: "completed",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    address: "Laureles, Medellín",
    price: 25000,
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
    transition: { staggerChildren: 0.1 },
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "completed":
      return "bg-[#333333] text-[#a3a3a3] border-[#404040]";
    case "cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-[#333333] text-[#a3a3a3] border-[#404040]";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "pending":
      return "Pendiente";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};

export default function MisCitasPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

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

  const displayAppointments = activeTab === "upcoming" ? mockAppointments : pastAppointments;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
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
              Mis Citas
            </motion.h1>
            <motion.p variants={fadeIn} className="text-[#737373]">
              Gestiona tus reservas y citas programadas
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "upcoming"
                  ? "bg-white text-black"
                  : "bg-[#111111] text-[#a3a3a3] border border-[#222222] hover:border-[#404040]"
              }`}
            >
              Próximas ({mockAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "past"
                  ? "bg-white text-black"
                  : "bg-[#111111] text-[#a3a3a3] border border-[#222222] hover:border-[#404040]"
              }`}
            >
              Historial ({pastAppointments.length})
            </button>
          </div>

          {/* Appointments List */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {displayAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                variants={fadeIn}
                className="bg-[#111111] rounded-2xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-32 sm:h-auto">
                    <img
                      src={appointment.image}
                      alt={appointment.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {appointment.businessName}
                        </h3>
                        <p className="text-[#a3a3a3]">{appointment.serviceName}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[#737373] mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {appointment.price > 0 && (
                        <span className="text-white font-semibold">
                          ${appointment.price.toLocaleString("es-CO")}
                        </span>
                      )}
                      <div className="flex gap-2 ml-auto">
                        {activeTab === "upcoming" && appointment.status !== "cancelled" && (
                          <>
                            <button className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a3a3a3] hover:border-[#404040] hover:text-white transition-colors text-sm">
                              Cancelar
                            </button>
                            <button className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-[#e5e5e5] transition-colors text-sm flex items-center gap-1">
                              Ver detalles
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {activeTab === "past" && (
                          <button className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-[#e5e5e5] transition-colors text-sm">
                            Reservar de nuevo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {displayAppointments.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tienes citas {activeTab === "upcoming" ? "programadas" : "anteriores"}
              </h3>
              <p className="text-[#737373] mb-6">
                {activeTab === "upcoming"
                  ? "Explora los mejores lugares y reserva tu próxima cita"
                  : "Tu historial de citas aparecerá aquí"}
              </p>
              {activeTab === "upcoming" && (
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-[#e5e5e5] transition-colors"
                >
                  Explorar lugares
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
