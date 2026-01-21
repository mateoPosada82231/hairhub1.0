"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faCalendarDays,
  faUsers,
  faStar,
  faPlus,
  faGear,
  faPen,
  faTrash,
  faClock,
  faSpinner,
  faScissors,
  faDollarSign,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { notify } from "@/components/ui/toast";
import type { BusinessSummary, Business, Service, Worker, WorkerScheduleRequest, BusinessImage } from "@/types";
import "@/styles/mi-negocio.css";
import "@/styles/reviews.css";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Componente para crear/editar negocio
function BusinessForm({
  business,
  onSave,
  onCancel,
}: {
  business?: Business | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: business?.name || "",
    category: business?.category || "BARBERSHOP",
    description: business?.description || "",
    address: business?.address || "",
    city: business?.city || "",
    phone: business?.phone || "",
    cover_image_url: business?.cover_image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (business) {
        await api.updateBusiness(business.id, formData);
        notify.success("Negocio actualizado correctamente");
      } else {
        await api.createBusiness(formData as any);
        notify.success("¡Negocio creado exitosamente!");
      }
      onSave();
    } catch (err: any) {
      const errorMessage = err.message || "Error al guardar el negocio";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {business ? "Editar Negocio" : "Nuevo Negocio"}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del negocio</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Mi Barbería"
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="BARBERSHOP">Barbería</option>
              <option value="HAIR_SALON">Salón de Belleza</option>
              <option value="NAIL_SALON">Manicura/Pedicura</option>
              <option value="SPA">Spa</option>
              <option value="CAR_WASH">Autolavado</option>
              <option value="PET_GROOMING">Peluquería de Mascotas</option>
              <option value="TATTOO_STUDIO">Estudio de Tatuajes</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu negocio..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="Calle 123 #45-67"
              />
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="Medellín"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="300 123 4567"
            />
          </div>

          <div className="form-group">
            <label>URL de imagen de portada</label>
            <input
              type="url"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para crear/editar servicio
function ServiceForm({
  businessId,
  service,
  onSave,
  onCancel,
}: {
  businessId: number;
  service?: Service | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    duration_minutes: service?.duration_minutes || 30,
    price: service?.price || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (service) {
        await api.updateService(businessId, service.id, formData);
      } else {
        await api.createService(businessId, formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {service ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del servicio</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Corte de cabello"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el servicio..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duración (minutos)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                }
                required
                min={5}
                step={5}
              />
            </div>
            <div className="form-group">
              <label>Precio ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                required
                min={0}
                step={1000}
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para agregar trabajador
function WorkerForm({
  businessId,
  onSave,
  onCancel,
}: {
  businessId: number;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.addWorker(businessId, formData);
      onSave();
    } catch (err: any) {
      setError(err.message || "Error al agregar trabajador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Agregar Trabajador</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="juan@email.com"
            />
          </div>

          <div className="form-group">
            <label>Cargo / Posición</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Barbero Senior"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Agregando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para configurar horarios de trabajador
function WorkerScheduleForm({
  businessId,
  worker,
  onSave,
  onCancel,
}: {
  businessId: number;
  worker: Worker;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [schedules, setSchedules] = useState<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[]>(() => {
    // Initialize with existing schedules or default empty schedule
    if (worker.schedules && worker.schedules.length > 0) {
      return worker.schedules.map(s => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_available: s.is_available,
      }));
    }
    // Default: all days with 9am-6pm schedule
    return DAY_NAMES.map((_, index) => ({
      day_of_week: index,
      start_time: "09:00",
      end_time: "18:00",
      is_available: index > 0 && index < 6, // Monday-Friday available by default
    }));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleDay = (dayIndex: number) => {
    setSchedules(prev => prev.map(s => 
      s.day_of_week === dayIndex 
        ? { ...s, is_available: !s.is_available }
        : s
    ));
  };

  const handleTimeChange = (dayIndex: number, field: "start_time" | "end_time", value: string) => {
    setSchedules(prev => prev.map(s =>
      s.day_of_week === dayIndex
        ? { ...s, [field]: value }
        : s
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Only send available schedules
      const availableSchedules = schedules.filter(s => s.is_available);
      await api.setWorkerSchedule(businessId, worker.id, availableSchedules);
      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar el horario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-large">
        <h2 className="modal-title">
          Horario de {worker.full_name}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="schedule-instructions">
            Configura los días y horas de trabajo para este profesional.
          </p>

          <div className="schedule-grid">
            {schedules.map((schedule) => (
              <div 
                key={schedule.day_of_week} 
                className={`schedule-day ${schedule.is_available ? "active" : ""}`}
              >
                <div className="schedule-day-header">
                  <label className="schedule-toggle">
                    <input
                      type="checkbox"
                      checked={schedule.is_available}
                      onChange={() => handleToggleDay(schedule.day_of_week)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="day-name">{DAY_NAMES[schedule.day_of_week]}</span>
                </div>
                
                {schedule.is_available && (
                  <div className="schedule-times">
                    <div className="time-input">
                      <label>Inicio</label>
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) => handleTimeChange(schedule.day_of_week, "start_time", e.target.value)}
                      />
                    </div>
                    <span className="time-separator">-</span>
                    <div className="time-input">
                      <label>Fin</label>
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) => handleTimeChange(schedule.day_of_week, "end_time", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : "Guardar horario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MiNegocioContent() {
  // Estados principales
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de modales
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingWorkerSchedule, setEditingWorkerSchedule] = useState<Worker | null>(null);

  // Tab activo
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "workers">("overview");

  // Estados de galería
  const [galleryImages, setGalleryImages] = useState<BusinessImage[]>([]);
  const [showAddImageForm, setShowAddImageForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");
  const [addingImage, setAddingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  // Cargar imágenes de galería
  const loadGalleryImages = useCallback(async (businessId: number) => {
    try {
      const images = await api.getBusinessImages(businessId);
      setGalleryImages(images);
    } catch (err: any) {
      console.error("Error loading gallery images:", err);
    }
  }, []);

  // Cargar detalles de un negocio
  const loadBusinessDetails = useCallback(async (id: number) => {
    try {
      const [business, servicesData, workersData] = await Promise.all([
        api.getBusinessById(id),
        api.getServices(id),
        api.getWorkers(id),
      ]);
      setSelectedBusiness(business);
      setServices(servicesData);
      setWorkers(workersData);
      loadGalleryImages(id);
    } catch (err: any) {
      console.error("Error loading business details:", err);
    }
  }, [loadGalleryImages]);

  // Cargar mis negocios
  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMyBusinesses();
      setBusinesses(data);
      if (data.length > 0) {
        loadBusinessDetails(data[0].id);
      }
    } catch (err: any) {
      console.error("Error loading businesses:", err);
    } finally {
      setLoading(false);
    }
  }, [loadBusinessDetails]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // Handlers de formularios
  const handleBusinessSaved = () => {
    setShowBusinessForm(false);
    loadBusinesses();
  };

  const handleServiceSaved = () => {
    setShowServiceForm(false);
    setEditingService(null);
    if (selectedBusiness) {
      loadBusinessDetails(selectedBusiness.id);
    }
  };

  const handleWorkerSaved = () => {
    setShowWorkerForm(false);
    if (selectedBusiness) {
      loadBusinessDetails(selectedBusiness.id);
    }
  };

  const handleScheduleSaved = () => {
    setShowScheduleForm(false);
    setEditingWorkerSchedule(null);
    if (selectedBusiness) {
      loadBusinessDetails(selectedBusiness.id);
    }
  };

  const handleEditSchedule = (worker: Worker) => {
    setEditingWorkerSchedule(worker);
    setShowScheduleForm(true);
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!selectedBusiness) return;
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

    try {
      await api.deleteService(selectedBusiness.id, serviceId);
      loadBusinessDetails(selectedBusiness.id);
    } catch (err: any) {
      alert(err.message || "Error al eliminar servicio");
    }
  };

  const handleDeleteWorker = async (workerId: number) => {
    if (!selectedBusiness) return;
    if (!confirm("¿Estás seguro de eliminar este trabajador?")) return;

    try {
      await api.removeWorker(selectedBusiness.id, workerId);
      loadBusinessDetails(selectedBusiness.id);
    } catch (err: any) {
      alert(err.message || "Error al eliminar trabajador");
    }
  };

  // Handlers de galería
  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !newImageUrl.trim()) return;

    setAddingImage(true);
    try {
      await api.addBusinessImage(selectedBusiness.id, {
        image_url: newImageUrl.trim(),
        caption: newImageCaption.trim() || undefined,
      });
      await loadGalleryImages(selectedBusiness.id);
      setNewImageUrl("");
      setNewImageCaption("");
      setShowAddImageForm(false);
      notify.success("Imagen agregada correctamente");
    } catch (err: any) {
      notify.error(err.message || "Error al agregar imagen");
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!selectedBusiness) return;
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    setDeletingImageId(imageId);
    try {
      await api.removeBusinessImage(selectedBusiness.id, imageId);
      await loadGalleryImages(selectedBusiness.id);
      notify.success("Imagen eliminada correctamente");
    } catch (err: any) {
      notify.error(err.message || "Error al eliminar imagen");
    } finally {
      setDeletingImageId(null);
    }
  };

  // Estado de carga
  if (loading && businesses.length === 0) {
    return (
      <div className="mi-negocio-loading">
        <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
        <p>Cargando tus negocios...</p>
      </div>
    );
  }

  return (
    <div className="mi-negocio-container">
      <Navbar />

      <main className="mi-negocio-main">
        <div className="mi-negocio-content">
          {/* Header */}
          <header className="mi-negocio-header">
            <div>
              <h1 className="page-title">Mi Negocio</h1>
              <p className="page-subtitle">Gestiona tu negocio, servicios y trabajadores</p>
            </div>
            <button onClick={() => setShowBusinessForm(true)} className="btn-primary">
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Negocio
            </button>
          </header>

          {/* Lista de negocios (si hay más de uno) */}
          {businesses.length > 1 && (
            <div className="business-selector">
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => loadBusinessDetails(b.id)}
                  className={`business-selector-item ${
                    selectedBusiness?.id === b.id ? "active" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faStore} />
                  {b.name}
                </button>
              ))}
            </div>
          )}

          {/* No tiene negocios */}
          {businesses.length === 0 && !loading && (
            <div className="empty-state-container">
              <div className="empty-state-icon">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <h2>No tienes negocios registrados</h2>
              <p>Crea tu primer negocio para empezar a recibir reservas</p>
              <button onClick={() => setShowBusinessForm(true)} className="btn-primary">
                <FontAwesomeIcon icon={faPlus} />
                Crear mi primer negocio
              </button>
            </div>
          )}

          {/* Contenido del negocio seleccionado */}
          {selectedBusiness && (
            <>
              {/* Business Card */}
              <div className="business-card">
                <div className="business-card-image">
                  <img
                    src={selectedBusiness.cover_image_url || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"}
                    alt={selectedBusiness.name}
                  />
                </div>
                <div className="business-card-content">
                  <div className="business-card-header">
                    <div>
                      <span className="business-category">
                        {selectedBusiness.category_display}
                      </span>
                      <h2 className="business-name">{selectedBusiness.name}</h2>
                      <div className="business-rating">
                        <FontAwesomeIcon icon={faStar} className="star-icon" />
                        <span>{(selectedBusiness.average_rating || 0).toFixed(1)}</span>
                        <span className="rating-count">
                          ({selectedBusiness.total_reviews} reseñas)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBusinessForm(true)}
                      className="btn-icon"
                      title="Editar negocio"
                    >
                      <FontAwesomeIcon icon={faGear} />
                    </button>
                  </div>
                  <p className="business-address">
                    {selectedBusiness.address}, {selectedBusiness.city}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon stat-icon-blue">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </div>
                  <div className="stat-value">-</div>
                  <div className="stat-label">Citas hoy</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stat-icon-green">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                  <div className="stat-value">-</div>
                  <div className="stat-label">Ingresos semana</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stat-icon-purple">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="stat-value">{workers.length}</div>
                  <div className="stat-label">Trabajadores</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stat-icon-orange">
                    <FontAwesomeIcon icon={faScissors} />
                  </div>
                  <div className="stat-value">{services.length}</div>
                  <div className="stat-label">Servicios</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs-container">
                <div className="tabs">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  >
                    Resumen
                  </button>
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`tab ${activeTab === "services" ? "active" : ""}`}
                  >
                    Servicios ({services.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("workers")}
                    className={`tab ${activeTab === "workers" ? "active" : ""}`}
                  >
                    Trabajadores ({workers.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="overview-content">
                      <div className="overview-section">
                        <h3>Descripción</h3>
                        <p>{selectedBusiness.description || "Sin descripción"}</p>
                      </div>
                      <div className="overview-section">
                        <h3>Información de contacto</h3>
                        <p><strong>Dirección:</strong> {selectedBusiness.address}, {selectedBusiness.city}</p>
                        <p><strong>Teléfono:</strong> {selectedBusiness.phone || "No especificado"}</p>
                      </div>

                      {/* Gallery Management */}
                      <div className="overview-section gallery-management">
                        <div className="gallery-management-header">
                          <h4>
                            <FontAwesomeIcon icon={faImage} />
                            Galería de imágenes
                          </h4>
                          <button
                            onClick={() => setShowAddImageForm(!showAddImageForm)}
                            className="btn-add-image"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            Agregar imagen
                          </button>
                        </div>

                        {/* Add Image Form */}
                        {showAddImageForm && (
                          <form onSubmit={handleAddImage} className="add-image-form">
                            <div className="form-row">
                              <div className="form-group">
                                <label>URL de la imagen</label>
                                <input
                                  type="url"
                                  value={newImageUrl}
                                  onChange={(e) => setNewImageUrl(e.target.value)}
                                  placeholder="https://..."
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>Leyenda (opcional)</label>
                                <input
                                  type="text"
                                  value={newImageCaption}
                                  onChange={(e) => setNewImageCaption(e.target.value)}
                                  placeholder="Descripción de la imagen"
                                  maxLength={255}
                                />
                              </div>
                            </div>
                            <div className="form-actions">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddImageForm(false);
                                  setNewImageUrl("");
                                  setNewImageCaption("");
                                }}
                                className="btn-secondary"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={addingImage || !newImageUrl.trim()}
                                className="btn-primary"
                              >
                                {addingImage ? "Agregando..." : "Agregar"}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Gallery Grid */}
                        <div className="gallery-management-grid">
                          {galleryImages.length === 0 ? (
                            <div className="gallery-empty">
                              <FontAwesomeIcon icon={faImage} />
                              <p>No hay imágenes en la galería</p>
                            </div>
                          ) : (
                            galleryImages.map((image) => (
                              <div key={image.id} className="gallery-management-item">
                                <img src={image.image_url} alt={image.caption || "Imagen"} />
                                {image.caption && (
                                  <div className="gallery-item-caption">{image.caption}</div>
                                )}
                                <button
                                  onClick={() => handleDeleteImage(image.id)}
                                  disabled={deletingImageId === image.id}
                                  className="gallery-item-delete"
                                  title="Eliminar imagen"
                                >
                                  {deletingImageId === image.id ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                  ) : (
                                    <FontAwesomeIcon icon={faTrash} />
                                  )}
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Services Tab */}
                  {activeTab === "services" && (
                    <div className="services-content">
                      <div className="section-header">
                        <h3>Servicios</h3>
                        <button
                          onClick={() => {
                            setEditingService(null);
                            setShowServiceForm(true);
                          }}
                          className="btn-secondary btn-sm"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Agregar servicio
                        </button>
                      </div>

                      {services.length === 0 ? (
                        <div className="empty-list">
                          <p>No hay servicios registrados</p>
                        </div>
                      ) : (
                        <div className="services-list">
                          {services.map((service) => (
                            <div key={service.id} className="service-item">
                              <div className="service-info">
                                <h4>{service.name}</h4>
                                <p className="service-description">
                                  {service.description || "Sin descripción"}
                                </p>
                                <div className="service-meta">
                                  <span>
                                    <FontAwesomeIcon icon={faClock} />
                                    {service.duration_minutes} min
                                  </span>
                                  <span>
                                    <FontAwesomeIcon icon={faDollarSign} />
                                    ${service.price.toLocaleString("es-CO")}
                                  </span>
                                </div>
                              </div>
                              <div className="service-actions">
                                <button
                                  onClick={() => {
                                    setEditingService(service);
                                    setShowServiceForm(true);
                                  }}
                                  className="btn-icon-sm"
                                  title="Editar"
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="btn-icon-sm btn-danger"
                                  title="Eliminar"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Workers Tab */}
                  {activeTab === "workers" && (
                    <div className="workers-content">
                      <div className="section-header">
                        <h3>Trabajadores</h3>
                        <button
                          onClick={() => setShowWorkerForm(true)}
                          className="btn-secondary btn-sm"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Agregar trabajador
                        </button>
                      </div>

                      {workers.length === 0 ? (
                        <div className="empty-list">
                          <p>No hay trabajadores registrados</p>
                        </div>
                      ) : (
                        <div className="workers-list">
                          {workers.map((worker) => (
                            <div key={worker.id} className="worker-item">
                              <div className="worker-avatar">
                                {worker.full_name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div className="worker-info">
                                <h4>{worker.full_name}</h4>
                                <p>{worker.position || "Sin cargo asignado"}</p>
                                <p className="worker-email">{worker.email}</p>
                                {worker.schedules && worker.schedules.length > 0 && (
                                  <p className="worker-schedule-summary">
                                    <FontAwesomeIcon icon={faClock} />
                                    {worker.schedules.filter(s => s.is_available).length} días configurados
                                  </p>
                                )}
                              </div>
                              <div className="worker-actions">
                                <button
                                  onClick={() => handleEditSchedule(worker)}
                                  className="btn-icon-sm"
                                  title="Configurar horario"
                                >
                                  <FontAwesomeIcon icon={faClock} />
                                </button>
                                <button
                                  onClick={() => handleDeleteWorker(worker.id)}
                                  className="btn-icon-sm btn-danger"
                                  title="Eliminar"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modales */}
      {showBusinessForm && (
        <BusinessForm
          business={selectedBusiness}
          onSave={handleBusinessSaved}
          onCancel={() => setShowBusinessForm(false)}
        />
      )}

      {showServiceForm && selectedBusiness && (
        <ServiceForm
          businessId={selectedBusiness.id}
          service={editingService}
          onSave={handleServiceSaved}
          onCancel={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
        />
      )}

      {showWorkerForm && selectedBusiness && (
        <WorkerForm
          businessId={selectedBusiness.id}
          onSave={handleWorkerSaved}
          onCancel={() => setShowWorkerForm(false)}
        />
      )}

      {showScheduleForm && selectedBusiness && editingWorkerSchedule && (
        <WorkerScheduleForm
          businessId={selectedBusiness.id}
          worker={editingWorkerSchedule}
          onSave={handleScheduleSaved}
          onCancel={() => {
            setShowScheduleForm(false);
            setEditingWorkerSchedule(null);
          }}
        />
      )}
    </div>
  );
}

export default function MiNegocioPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <MiNegocioContent />
    </ProtectedRoute>
  );
}
