// Types for the HairHub application

export type UserRole = "OWNER" | "WORKER" | "CLIENT";

export interface User {
    id: number;
    email: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
    profile?: Profile;
}

export interface Profile {
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
}

export type BusinessCategory =
    | "BARBERSHOP"
    | "HAIR_SALON"
    | "NAIL_SALON"
    | "SPA"
    | "CAR_WASH"
    | "PET_GROOMING"
    | "TATTOO_STUDIO"
    | "OTHER";

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
    BARBERSHOP: "Barbería",
    HAIR_SALON: "Salón de Belleza",
    NAIL_SALON: "Manicura/Pedicura",
    SPA: "Spa",
    CAR_WASH: "Autolavado",
    PET_GROOMING: "Peluquería de Mascotas",
    TATTOO_STUDIO: "Estudio de Tatuajes",
    OTHER: "Otro",
};

export const CATEGORY_ICONS: Record<BusinessCategory, string> = {
    BARBERSHOP: "✂️",
    HAIR_SALON: "💇‍♀️",
    NAIL_SALON: "💅",
    SPA: "🧖",
    CAR_WASH: "🚗",
    PET_GROOMING: "🐕",
    TATTOO_STUDIO: "🎨",
    OTHER: "📍",
};

export interface Business {
    id: number;
    name: string;
    category: BusinessCategory;
    description?: string;
    address?: string;
    city?: string;
    phone?: string;
    coverImageUrl?: string;
    active: boolean;
    averageRating?: number;
    totalReviews?: number;
    services?: Service[];
    galleryImages?: string[];
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    durationMinutes: number;
    price: number;
    imageUrl?: string;
    active: boolean;
}

export type AppointmentStatus =
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

export interface Appointment {
    id: number;
    client: User;
    worker: Worker;
    service: Service;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    clientNotes?: string;
    cancellationReason?: string;
    createdAt: string;
}

export interface Worker {
    id: number;
    user: User;
    business: Business;
    position?: string;
    active: boolean;
}
