import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faCalendarAlt, faClock, faCut, faCheck,
  faTimes, faInfoCircle, faScissors, faChevronLeft,
  faChevronRight, faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import '../styles/BookAppointment.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para el formulario
  const [formData, setFormData] = useState({
    barberId: '',
    barberName: '',
    barberLastName: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceId: '',
    serviceName: '',
    servicePrice: '',
    notes: ''
  });

  // Estados para los modales
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Datos
  const [barbers, setBarbers] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [services, setServices] = useState([]);

  // Estados para el calendario mejorado
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Obtener barberos y servicios al cargar el componente
    fetchBarbers();
    fetchServices();
  }, []);

  // Obtener barberos desde la API
  const fetchBarbers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/hh/barbero', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener la lista de barberos');
      }

      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener servicios desde la API
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/services', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener la lista de servicios');
      }

      const data = await response.json();
      const formattedServices = data.map((service) => ({
        id: service.idServicio,
        name: service.nombreServicio,
        price: service.precioBaseServicio,
        duration: service.duracionEstimadaServicio
          ? parseInt(service.duracionEstimadaServicio)
          : 0,
        description: service.notes || "", // en caso de que lo tengas
      }));
      setServices(formattedServices);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener horas disponibles para una fecha y barbero específicos
  const fetchAvailableHours = async (formattedDate, barberId) => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No hay token de autenticación');
        setError('Por favor, inicia sesión para ver los horarios disponibles');
        return;
      }

      // Verificar que se haya seleccionado un servicio
      if (!formData.serviceId) {
        setError('Por favor, selecciona un servicio primero');
        return;
      }

      // Obtener el servicio seleccionado
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (!selectedService) {
        setError('Servicio no encontrado');
        return;
      }

      // Obtener duración en minutos desde el servicio seleccionado
      let duracionMinutos = 40; // valor por defecto

      if (selectedService.duration) {
        // Usar directamente la duración ya procesada en fetchServices
        duracionMinutos = selectedService.duration;
      } else {
        console.warn("No se encontró duración para el servicio, usando valor por defecto de 40 minutos");
      }

      console.log('Iniciando fetchAvailableHours:', {
        formattedDate,
        barberId,
        serviceId: formData.serviceId,
        duracionMinutos
      });

      // Usar el parámetro correcto duracionMinutos
      const response = await fetch(
        `http://localhost:8080/api/appointments/barbers/${barberId}/availability/${formattedDate}?duracionMinutos=${duracionMinutos}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al obtener los horarios disponibles');
      }

      // El backend ya envía la estructura correcta
      const bloques = await response.json();
      setAvailableHours(bloques);

    } catch (error) {
      console.error('Error en fetchAvailableHours:', error);
      setError(error.message || 'Error al obtener los horarios disponibles');
      setAvailableHours([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejadores para los modales
  const openCalendarModal = () => {
    setShowCalendarModal(true);
  };

  const openBarberModal = () => {
    setShowBarberModal(true);
  };

  const openTimeModal = () => {
    if (!formData.barberId || !formData.appointmentDate) {
      setError('Primero debes seleccionar un barbero y una fecha');
      return;
    }

    if (!formData.serviceId) {
      setError('Por favor, selecciona un servicio primero');
      return;
    }

    // Verificar si la fecha seleccionada es hoy
    const [year, month, day] = formData.appointmentDate.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('No se pueden agendar citas en fechas pasadas');
      return;
    }

    // Comprobar si la fecha seleccionada es domingo (0 = domingo)
    if (selectedDate.getDay() === 0) {
      setError('No se pueden agendar citas los domingos. Por favor selecciona otro día.');
      return;
    }

    setShowTimeModal(true);
    setError('');
    setAvailableHours([]); // Limpiar horas anteriores
    fetchAvailableHours(formData.appointmentDate, formData.barberId);
  };

  const openServiceModal = () => {
    setShowServiceModal(true);
  };

  // Funciones para el calendario mejorado
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Días vacíos al inicio para alinear el calendario
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSunday = date.getDay() === 0; // 0 = Sunday in JS
      const isSelectedDate = selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isPastDate = date < today;

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isSelectedDate ? 'selected' : ''} ${isPastDate || isSunday ? 'disabled' : ''}`}
          onClick={() => {
            // No permitir seleccionar domingos ni fechas pasadas
            if (isPastDate) return;
            if (isSunday) {
              setError('No se pueden agendar citas los domingos. Por favor selecciona otro día.');
              return;
            }
            handleDateSelect(new Date(year, month, day));
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Seleccionar fecha
  const handleDateSelect = (date) => {
    // Verificar si la fecha seleccionada es hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Si la fecha seleccionada es anterior a hoy
    if (date < today) {
      setError('No se pueden seleccionar fechas pasadas');
      return;
    }

    setSelectedDate(date);

    // Crear la fecha manteniendo la zona horaria local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData({
      ...formData,
      appointmentDate: formattedDate
    });
    setShowCalendarModal(false);
  };

  // Seleccionar barbero
  const handleBarberSelect = (barber) => {
    setFormData({
      ...formData,
      barberId: barber.idBarbero,
      barberName: `${barber.nombreBarbero}`,
      barberLastName: `${barber.apellidoBarbero}`
    });
    setShowBarberModal(false);
  };

  // Seleccionar hora
  const handleTimeSelect = (time) => {
    // Ensure time is in HH:mm format
    let formattedTime = time;
    if (time && !time.includes(':')) {
      // If time is just a number (minutes), convert it to HH:mm
      const hours = Math.floor(parseInt(time) / 60);
      const minutes = parseInt(time) % 60;
      formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    setFormData({
      ...formData,
      appointmentTime: formattedTime
    });
    setShowTimeModal(false);
  };

  // Seleccionar servicio
  const handleServiceSelect = (service) => {
    setFormData({
      ...formData,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price
    });
    setShowServiceModal(false);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar que todos los campos requeridos estén llenos
      if (!formData.barberId || !formData.appointmentDate || !formData.appointmentTime || !formData.serviceId) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      // Obtener el token y decodificarlo para obtener el ID del cliente
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const clientId = tokenPayload.sub;

      // // Asegurar que la hora esté en formato HH:mm
      // const timeParts = formData.appointmentTime.split(':');
      // const formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;

      // Asegurar que la fecha esté en formato yyyy-MM-dd
      const [year, month, day] = formData.appointmentDate.split('-');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      // Validar que la fecha no sea domingo
      const checkDate = new Date(parseInt(year), parseInt(month, 10) - 1, parseInt(day, 10));
      if (checkDate.getDay() === 0) {
        throw new Error('No se pueden agendar citas los domingos. Por favor selecciona otra fecha.');
      }

      // Preparar los datos de la cita
      const appointmentData = {
        barberId: parseInt(formData.barberId),
        clientId: parseInt(clientId),
        date: formattedDate,
        time: formData.appointmentTime,
        serviceId: parseInt(formData.serviceId),
        notes: formData.notes || ''
      };

      console.log('Enviando datos de la cita:', appointmentData);

      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        setSuccess('Cita agendada con éxito');
        // Redireccionar después de 2 segundos
        setTimeout(() => {
          navigate('/my-appointments');
        }, 2000);
        return;
      }

      // Si la respuesta no es exitosa, intentar obtener el mensaje de error
      let errorMessage = 'Error al agendar la cita';
      let errorDetails = '';

      try {
        // Intentar obtener el texto de la respuesta primero
        const responseText = await response.text();
        console.log('Texto de respuesta:', responseText);

        // Si hay texto, intentar parsearlo como JSON
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            console.log('Datos de error parseados:', errorData);
            errorMessage = errorData.message || errorMessage;
            errorDetails = errorData.details || '';
          } catch (e) {
            // Si no es JSON, usar el texto como mensaje de error
            errorMessage = responseText;
          }
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      } catch (e) {
        console.error('Error al procesar la respuesta:', e);
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }

      throw new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);

    } catch (error) {
      console.error('Error completo al agendar la cita:', error);
      setError(error.message || 'Error al agendar la cita. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar los slots tal como llegan del backend
  const renderTimeSlots = () => {
    if (availableHours.length === 0) {
      return <p>No hay horarios disponibles para esta fecha</p>;
    }

    return availableHours.map((slot, index) => {
      const isAvailable = slot.disponible === true;
      const isDisabled = !isAvailable;
      let statusLabel = '';
      if (slot.status && slot.status.toLowerCase() === 'ocupado') statusLabel = 'Ocupado';
      else if (slot.status && slot.status.toLowerCase() === 'descanso') statusLabel = 'Almuerzo';
      else if (slot.status && slot.status.toLowerCase() === 'disponible') statusLabel = 'Libre';
      else statusLabel = slot.status || '';

      return (
        <button
          key={index}
          type="button"
          className={`time-slot ${isAvailable ? 'available' : 'unavailable'}`}
          onClick={() => {
            if (isAvailable) {
              handleTimeSelect(slot.horaInicio || slot.time);
            }
          }}
          disabled={isDisabled}
          title={slot.info || statusLabel}
        >
          <div className="time-slot-content">
            <span className="time-range">
              {(slot.horaInicio || slot.time)} - {slot.horaFin}
            </span>
            <span className={`slot-status ${isAvailable ? 'text-success' : 'text-muted'}`}>
              {statusLabel}
            </span>
            {slot.info && !isAvailable && (
              <span className="slot-info">{slot.info}</span>
            )}
          </div>
        </button>
      );
    });
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-light back-button"
            onClick={() => navigate("/dashboard")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Volver
          </button>
          <h2 className="booking-title">Agendar Cita</h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {success}
        </div>
      )}

      <div className="booking-form-container">
        <form onSubmit={handleSubmit}>
          <div className="info-box mb-4">
            <div className="info-icon">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <div className="info-text">
              Para agendar una cita, selecciona un barbero, servicio, fecha y hora.
            </div>
          </div>

          {/* Seleccionar barbero */}
          <div className="mb-4">
            <label className="form-label-dark">Barbero</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formData.barberLastName ? `${formData.barberName} ${formData.barberLastName}` : formData.barberName}
                readOnly
                placeholder="Seleccionar barbero"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={openBarberModal}
              >
                <FontAwesomeIcon icon={faCut} className="me-2" />
                Seleccionar
              </button>
            </div>
          </div>

          {/* Seleccionar servicio */}
          <div className="mb-4">
            <label className="form-label-dark">Servicio</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={
                  formData.serviceName
                    ? `${formData.serviceName
                    } - $${formData.servicePrice.toLocaleString()}`
                    : ""
                }
                readOnly
                placeholder="Seleccionar servicio"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={openServiceModal}
              >
                <FontAwesomeIcon icon={faScissors} className="me-2" />
                Seleccionar
              </button>
            </div>
          </div>

          {/* Seleccionar fecha */}
          <div className="mb-4">
            <label className="form-label-dark">Fecha</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formData.appointmentDate ? formData.appointmentDate.split('-').reverse().join('/') : ''}
                readOnly
                placeholder="Seleccionar fecha"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (selectedDate && selectedDate < today) {
                    setError('No puedes seleccionar una fecha pasada');
                    return;
                  }
                  openCalendarModal();
                }}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Seleccionar
              </button>
            </div>
          </div>

          {/* Seleccionar hora */}
          <div className="mb-4">
            <label className="form-label-dark">Hora</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formData.appointmentTime}
                readOnly
                placeholder="Seleccionar hora"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={openTimeModal}
              >
                <FontAwesomeIcon icon={faClock} className="me-2" />
                Seleccionar
              </button>
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="mb-4">
            <label className="form-label-dark">Notas adicionales (opcional)</label>
            <textarea
              className="form-control"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Agrega cualquier información adicional para tu cita"
              rows="3"
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary booking-btn"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal para seleccionar fecha */}
      {showCalendarModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCalendarModal(false)}
        >
          <div
            className="modal-content calendar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h5 className="modal-title">Seleccionar Fecha</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCalendarModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={goToPrevMonth}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h5 className="calendar-month">
                  {currentMonth.toLocaleDateString("es", {
                    month: "long",
                    year: "numeric",
                  })}
                </h5>
                <button className="calendar-nav-btn" onClick={goToNextMonth}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              <div className="calendar-weekdays">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
              </div>
              <div className="calendar-days">{renderCalendar()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar barbero */}
      {showBarberModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBarberModal(false)}
        >
          <div
            className="modal-content barber-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h5 className="modal-title">
                Seleccionar Barbero
                {formData.barberName
                  ? `${formData.barberName} ${formData.barberLastName}`
                  : "Seleccionar Barbero"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowBarberModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="barber-card"
                  onClick={() => handleBarberSelect(barber)}
                >
                  <div className="barber-avatar">
                    <FontAwesomeIcon icon={faCut} />
                  </div>
                  <div className="barber-info">
                    <h5>{barber.nombreBarbero} {barber.apellidoBarbero}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar hora */}
      {showTimeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowTimeModal(false)}
        >
          <div
            className="modal-content time-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h5 className="modal-title">Seleccionar Hora</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowTimeModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="time-container">
                {renderTimeSlots()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar servicio */}
      {showServiceModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowServiceModal(false)}
        >
          <div
            className="modal-content service-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h5 className="modal-title">Seleccionar Servicio</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowServiceModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="services-container">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="service-icon">
                      <FontAwesomeIcon icon={faScissors} />
                    </div>
                    <div className="service-details">
                      <h5 className="service-name">{service.name}</h5>
                      <p className="service-description">
                        {service.description}
                      </p>
                      <div className="service-meta">
                        <span className="service-duration">
                          <FontAwesomeIcon icon={faClock} className="me-1" />
                          {service.duration} min
                        </span>
                        <span className="service-price">
                          <FontAwesomeIcon
                            icon={faDollarSign}
                            className="me-1"
                          />
                          {service.price !== undefined
                            ? `${service.price.toLocaleString()}`
                            : "Precio no disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;

