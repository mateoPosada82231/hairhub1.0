import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { notify } from "@/lib/toast";
import type { BusinessSummary, Business, Service, Worker } from "@/types";

interface UseBusinessManagementReturn {
  // State
  businesses: BusinessSummary[];
  selectedBusiness: Business | null;
  services: Service[];
  workers: Worker[];
  loading: boolean;
  error: string | null;

  // Actions
  loadBusinesses: () => Promise<void>;
  loadBusinessDetails: (id: number) => Promise<void>;
  deleteService: (serviceId: number) => Promise<void>;
  deleteWorker: (workerId: number) => Promise<void>;
  refreshCurrentBusiness: () => Promise<void>;
}

export function useBusinessManagement(): UseBusinessManagementReturn {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load details of a specific business
  const loadBusinessDetails = useCallback(async (id: number) => {
    try {
      setError(null);
      const [business, servicesData, workersData] = await Promise.all([
        api.getBusinessById(id),
        api.getServices(id),
        api.getWorkers(id),
      ]);
      setSelectedBusiness(business);
      setServices(servicesData);
      setWorkers(workersData);
    } catch (err: any) {
      const errorMessage = err.message || "Error al cargar detalles del negocio";
      setError(errorMessage);
      console.error("Error loading business details:", err);
    }
  }, []);

  // Load all businesses for the owner
  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyBusinesses();
      setBusinesses(data);
      if (data.length > 0) {
        await loadBusinessDetails(data[0].id);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Error al cargar negocios";
      setError(errorMessage);
      console.error("Error loading businesses:", err);
    } finally {
      setLoading(false);
    }
  }, [loadBusinessDetails]);

  // Refresh current business data
  const refreshCurrentBusiness = useCallback(async () => {
    if (selectedBusiness) {
      await loadBusinessDetails(selectedBusiness.id);
    }
  }, [selectedBusiness, loadBusinessDetails]);

  // Delete a service
  const deleteService = useCallback(async (serviceId: number) => {
    if (!selectedBusiness) return;
    
    try {
      await api.deleteService(selectedBusiness.id, serviceId);
      notify.success("Servicio eliminado correctamente");
      await loadBusinessDetails(selectedBusiness.id);
    } catch (err: any) {
      const errorMessage = err.message || "Error al eliminar servicio";
      notify.error(errorMessage);
      throw err;
    }
  }, [selectedBusiness, loadBusinessDetails]);

  // Delete a worker
  const deleteWorker = useCallback(async (workerId: number) => {
    if (!selectedBusiness) return;
    
    try {
      await api.removeWorker(selectedBusiness.id, workerId);
      notify.success("Trabajador eliminado correctamente");
      await loadBusinessDetails(selectedBusiness.id);
    } catch (err: any) {
      const errorMessage = err.message || "Error al eliminar trabajador";
      notify.error(errorMessage);
      throw err;
    }
  }, [selectedBusiness, loadBusinessDetails]);

  // Initial load
  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  return {
    businesses,
    selectedBusiness,
    services,
    workers,
    loading,
    error,
    loadBusinesses,
    loadBusinessDetails,
    deleteService,
    deleteWorker,
    refreshCurrentBusiness,
  };
}
