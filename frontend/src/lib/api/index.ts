// API Client - Unified exports
// This file provides backward compatibility with the old API structure
// while also exposing the new modular clients

export { API_BASE_URL } from "./base";
export type { ApiError } from "./base";
export { authApi } from "./auth";
export type { LoginRequest, RegisterRequest, AuthResponse } from "./auth";
export { businessApi } from "./business";
export { servicesApi } from "./services";
export { workersApi } from "./workers";
export { appointmentsApi } from "./appointments";
export { userApi } from "./user";
export { favoritesApi } from "./favorites";

// Re-export for backward compatibility with existing code that imports from api.ts
import { authApi } from "./auth";
import { businessApi } from "./business";
import { servicesApi } from "./services";
import { workersApi } from "./workers";
import { appointmentsApi } from "./appointments";
import { userApi } from "./user";
import { favoritesApi } from "./favorites";

// Unified API object for backward compatibility
export const api = {
  // Auth
  login: authApi.login.bind(authApi),
  register: authApi.register.bind(authApi),
  refreshToken: authApi.refreshToken.bind(authApi),
  logout: authApi.logout.bind(authApi),
  forgotPassword: authApi.forgotPassword.bind(authApi),
  validateResetToken: authApi.validateResetToken.bind(authApi),
  resetPassword: authApi.resetPassword.bind(authApi),

  // Businesses
  searchBusinesses: businessApi.searchBusinesses.bind(businessApi),
  getBusinessById: businessApi.getById.bind(businessApi),
  getMyBusinesses: businessApi.getMyBusinesses.bind(businessApi),
  createBusiness: businessApi.create.bind(businessApi),
  updateBusiness: businessApi.update.bind(businessApi),
  deleteBusiness: businessApi.delete.bind(businessApi),
  getCategories: businessApi.getCategories.bind(businessApi),

  // Services
  getServices: servicesApi.getAll.bind(servicesApi),
  getServiceById: servicesApi.getById.bind(servicesApi),
  createService: servicesApi.create.bind(servicesApi),
  updateService: servicesApi.update.bind(servicesApi),
  deleteService: servicesApi.delete.bind(servicesApi),

  // Workers
  getWorkers: workersApi.getAll.bind(workersApi),
  getWorkerById: workersApi.getById.bind(workersApi),
  addWorker: workersApi.add.bind(workersApi),
  removeWorker: workersApi.remove.bind(workersApi),
  getMyWorkerProfiles: workersApi.getMyProfiles.bind(workersApi),
  setWorkerSchedule: workersApi.setSchedule.bind(workersApi),

  // User
  updateProfile: userApi.updateProfile.bind(userApi),
  changePassword: userApi.changePassword.bind(userApi),

  // Favorites
  getMyFavorites: favoritesApi.getMy.bind(favoritesApi),
  getAllMyFavorites: favoritesApi.getAll.bind(favoritesApi),
  getMyFavoriteIds: favoritesApi.getIds.bind(favoritesApi),
  checkFavorite: favoritesApi.check.bind(favoritesApi),
  addFavorite: favoritesApi.add.bind(favoritesApi),
  removeFavorite: favoritesApi.remove.bind(favoritesApi),
  toggleFavorite: favoritesApi.toggle.bind(favoritesApi),

  // Appointments
  createAppointment: appointmentsApi.create.bind(appointmentsApi),
  getAppointmentById: appointmentsApi.getById.bind(appointmentsApi),
  getMyAppointments: appointmentsApi.getMy.bind(appointmentsApi),
  getMyUpcomingAppointments: appointmentsApi.getMyUpcoming.bind(appointmentsApi),
  getWorkerAppointments: appointmentsApi.getForWorker.bind(appointmentsApi),
  getUpcomingWorkerAppointments: appointmentsApi.getUpcomingForWorker.bind(appointmentsApi),
  updateAppointment: appointmentsApi.update.bind(appointmentsApi),
  cancelAppointment: appointmentsApi.cancel.bind(appointmentsApi),
  getWorkerAvailability: appointmentsApi.getWorkerAvailability.bind(appointmentsApi),
};
