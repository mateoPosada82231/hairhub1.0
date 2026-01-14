// API configuration and helper functions

import {
  BusinessSummary,
  Business,
  Service,
  Worker,
  Appointment,
  PageResponse,
  CategoryOption,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateWorkerRequest,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  BusinessCategory,
  AvailabilityResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiError {
  message: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user_id: number;
  full_name: string;
  email: string;
  role: "OWNER" | "WORKER" | "CLIENT";
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: "OWNER" | "WORKER" | "CLIENT";
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || "Error en la solicitud",
        status: response.status,
      } as ApiError;
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  // ==================== AUTH ====================
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>("/api/auth/logout", {
      method: "POST",
    });
  }

  // ==================== BUSINESSES ====================
  async searchBusinesses(params: {
    query?: string;
    category?: BusinessCategory;
    city?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<BusinessSummary>> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.category) searchParams.append("category", params.category);
    if (params.city) searchParams.append("city", params.city);
    searchParams.append("page", String(params.page ?? 0));
    searchParams.append("size", String(params.size ?? 10));

    return this.request<PageResponse<BusinessSummary>>(
      `/api/businesses/search?${searchParams.toString()}`
    );
  }

  async getBusinessById(id: number): Promise<Business> {
    return this.request<Business>(`/api/businesses/${id}`);
  }

  async getMyBusinesses(): Promise<BusinessSummary[]> {
    return this.request<BusinessSummary[]>("/api/businesses/my");
  }

  async createBusiness(data: CreateBusinessRequest): Promise<Business> {
    return this.request<Business>("/api/businesses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(id: number, data: UpdateBusinessRequest): Promise<Business> {
    return this.request<Business>(`/api/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(id: number): Promise<void> {
    return this.request<void>(`/api/businesses/${id}`, {
      method: "DELETE",
    });
  }

  async getCategories(): Promise<CategoryOption[]> {
    return this.request<CategoryOption[]>("/api/businesses/categories");
  }

  // ==================== SERVICES ====================
  async getServices(businessId: number): Promise<Service[]> {
    return this.request<Service[]>(`/api/businesses/${businessId}/services`);
  }

  async getServiceById(businessId: number, serviceId: number): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services/${serviceId}`);
  }

  async createService(businessId: number, data: CreateServiceRequest): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(
    businessId: number,
    serviceId: number,
    data: UpdateServiceRequest
  ): Promise<Service> {
    return this.request<Service>(`/api/businesses/${businessId}/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(businessId: number, serviceId: number): Promise<void> {
    return this.request<void>(`/api/businesses/${businessId}/services/${serviceId}`, {
      method: "DELETE",
    });
  }

  // ==================== WORKERS ====================
  async getWorkers(businessId: number): Promise<Worker[]> {
    return this.request<Worker[]>(`/api/businesses/${businessId}/workers`);
  }

  async getWorkerById(businessId: number, workerId: number): Promise<Worker> {
    return this.request<Worker>(`/api/businesses/${businessId}/workers/${workerId}`);
  }

  async addWorker(businessId: number, data: CreateWorkerRequest): Promise<Worker> {
    return this.request<Worker>(`/api/businesses/${businessId}/workers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async removeWorker(businessId: number, workerId: number): Promise<void> {
    return this.request<void>(`/api/businesses/${businessId}/workers/${workerId}`, {
      method: "DELETE",
    });
  }

  // Get worker profiles for the current user (businesses where they work)
  async getMyWorkerProfiles(): Promise<Worker[]> {
    return this.request<Worker[]>("/api/workers/me");
  }

  // ==================== APPOINTMENTS ====================
  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    return this.request<Appointment>(`/api/appointments/${id}`);
  }

  async getMyAppointments(page = 0, size = 10): Promise<PageResponse<Appointment>> {
    return this.request<PageResponse<Appointment>>(
      `/api/appointments/my?page=${page}&size=${size}`
    );
  }

  async getMyUpcomingAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>("/api/appointments/my/upcoming");
  }

  async getWorkerAppointments(
    workerId: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<Appointment>> {
    return this.request<PageResponse<Appointment>>(
      `/api/appointments/worker/${workerId}?page=${page}&size=${size}`
    );
  }

  async getUpcomingWorkerAppointments(workerId: number): Promise<Appointment[]> {
    return this.request<Appointment[]>(`/api/appointments/worker/${workerId}/upcoming`);
  }

  async updateAppointment(id: number, data: UpdateAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>(`/api/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : "";
    return this.request<Appointment>(`/api/appointments/${id}/cancel${params}`, {
      method: "POST",
    });
  }

  // ==================== AVAILABILITY ====================
  async getWorkerAvailability(
    workerId: number,
    date: string,
    duration?: number
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({ date });
    if (duration) params.append("duration", duration.toString());
    return this.request<AvailabilityResponse>(
      `/api/appointments/availability/${workerId}?${params.toString()}`
    );
  }
}

export const api = new ApiClient(API_BASE_URL);
