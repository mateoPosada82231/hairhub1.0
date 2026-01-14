import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faCalendarAlt, faClock, faCut,
    faTimes, faInfoCircle, faCheck, faTrashAlt, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import '../styles/MyAppointments.css';

const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

    // Estado para el modal de confirmación de cancelación
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            console.log("Haciendo fetch a: ", 'http://localhost:8080/api/appointments/mis-citas');

            const response = await fetch('http://localhost:8080/api/appointments/mis-citas', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las citas');
            }

            const data = await response.json();
            console.log('Citas obtenidas:', data);

            // Adaptar los datos que vienen del backend al formato que espera el frontend
            const dataAdaptada = data.map(cita => {
                const citaFecha = new Date(cita.fechaHora);
                const ahora = new Date();

                // Determinar estado según la fecha
                let estado = 'PENDING';
                if (citaFecha < ahora) {
                    estado = 'COMPLETED'; // Si la fecha ya pasó, se considera realizada
                }

                // Si la cita tiene un estado de cancelación desde el backend, respetarlo
                if (cita.estado === 'CANCELLED') {
                    estado = 'CANCELLED';
                }

                return {
                    id: cita.idCita,
                    date: cita.fechaHora,
                    time: cita.fechaHora.slice(11, 16), // extraer solo la hora
                    barberName: cita.nombreBarbero || '', // placeholder si no hay nombre
                    barberId: cita.idBarbero || '',
                    clientName: cita.nombreCliente || '',
                    notes: cita.notas ,
                    status: estado,
                    serviceName: 'Corte de cabello', // placeholder
                    serviceDuration: 30,
                    servicePrice: 20000
                };
            });

            setAppointments(dataAdaptada);

        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al cargar las citas');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCancelAppointment = async (appointmentId) => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Simular una pequeña espera para mejor experiencia de usuario
            await new Promise(resolve => setTimeout(resolve, 500));

            // Actualizar directamente el estado en el frontend sin esperar respuesta del backend
            setAppointments(prevAppointments =>
                prevAppointments.map(app =>
                    app.id === appointmentId
                        ? { ...app, status: 'CANCELLED' }
                        : app
                )
            );

            setSuccess('Cita cancelada exitosamente');
            setShowCancelModal(false);

            // Opcional: Intentar sincronizar con el backend en segundo plano
            const token = localStorage.getItem('authToken');
            fetch(`http://localhost:8080/api/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                // Error silencioso - no afecta la UI ya que ya actualizamos el estado
                console.error("Error al sincronizar con el backend:", error);
            });

        } catch (error) {
            console.error('Error:', error);
            setError("Ocurrió un error al procesar la cancelación");
        } finally {
            setIsLoading(false);
        }
    };

    const openCancelModal = (appointment) => {
        setAppointmentToCancel(appointment);
        setShowCancelModal(true);
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return <span className="status-badge confirmed">Confirmada</span>;
            case 'PENDING':
                return <span className="status-badge pending">Pendiente</span>;
            case 'CANCELLED':
                return <span className="status-badge cancelled">Cancelada</span>;
            case 'COMPLETED':
                return <span className="status-badge completed">Completada</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    const getFilteredAppointments = () => {
        const now = new Date();

        if (filter === 'upcoming') {
            return appointments.filter(app =>
                new Date(app.date) >= now && app.status !== 'CANCELLED'
            );
        } else if (filter === 'past') {
            return appointments.filter(app =>
                new Date(app.date) < now || app.status === 'CANCELLED' || app.status === 'COMPLETED'
            );
        } else {
            return appointments;
        }
    };

    const filteredAppointments = getFilteredAppointments();

    return (
        <div className="my-appointments-container">
            <div className="my-appointments-header">
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-light back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Volver
                    </button>
                    <h2 className="my-appointments-title">Mis Citas</h2>
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

            <div className="appointments-filter-container">
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Próximas
                    </button>
                    <button
                        type="button"
                        className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('past')}
                    >
                        Pasadas
                    </button>
                    <button
                        type="button"
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        Todas
                    </button>
                </div>
                {/* <button 
                    className="btn btn-outline-light refresh-button"
                    onClick={fetchAppointments}
                    disabled={isLoading}
                >
                    <FontAwesomeIcon icon={isLoading ? faSpinner : faCheck} className="me-2" spin={isLoading} />
                    Actualizar
                </button> */}
            </div>

            <div className="appointments-container">
                {isLoading ? (
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2 text-light">Cargando tus citas...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <h3>No tienes citas {filter === 'upcoming' ? 'próximas' : filter === 'past' ? 'pasadas' : ''}</h3>
                        <p>
                            {filter === 'upcoming'
                                ? 'No tienes citas programadas. ¿Por qué no agendas una?'
                                : filter === 'past'
                                    ? 'No tienes citas pasadas.'
                                    : 'No tienes ninguna cita registrada.'}
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/book-appointment')}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            Agendar Cita
                        </button>
                    </div>
                ) : (
                    <>
                        {filteredAppointments.map(appointment => (
                            <div key={appointment.id} className={`appointment-card ${appointment.status.toLowerCase()}`}>
                                <div className="appointment-header">
                                    <div className="appointment-date">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                        {formatDate(appointment.date)}
                                    </div>
                                    {getStatusBadge(appointment.status)}
                                </div>

                                <div className="appointment-details">
                                    <div className="appointment-service">
                                        <div className="service-icon">
                                            <FontAwesomeIcon icon={faCut} />
                                        </div>
                                        <div className="service-info">
                                            <h3>{appointment.serviceName}</h3>
                                            <p className="service-duration">
                                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                                {appointment.time} - Duración: {appointment.serviceDuration} min
                                            </p>
                                        </div>
                                    </div>

                                    <div className="appointment-barber">
                                        <div className="barber-info">
                                            <h4>Barbero:</h4>
                                            <p>{appointment.barberName} {appointment.barberLastName}</p>
                                        </div>
                                    </div>

                                    <div className="appointment-price">
                                        <h4>Precio:</h4>
                                        <p className="price">${appointment.servicePrice}</p>
                                    </div>
                                </div>

                                {appointment.notes && (
                                    <div className="appointment-notes">
                                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                        <span>{appointment.notes}</span>
                                    </div>
                                )}

                                {appointment.status === 'PENDING' &&
                                    new Date(appointment.date) > new Date() && (
                                        <div className="appointment-actions">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => openCancelModal(appointment)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                                                Cancelar Cita
                                            </button>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Modal de confirmación para cancelar cita */}
            {showCancelModal && appointmentToCancel && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar Cancelación</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowCancelModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="warning-icon">
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                            <p>¿Estás seguro que deseas cancelar esta cita?</p>
                            <div className="cancel-details">
                                <div><strong>Servicio:</strong> {appointmentToCancel.serviceName}</div>
                                <div><strong>Fecha:</strong> {formatDate(appointmentToCancel.date)}</div>
                                <div><strong>Hora:</strong> {appointmentToCancel.time}</div>
                                <div><strong>Barbero:</strong> {appointmentToCancel.barberName} {appointmentToCancel.barberLastName}</div>
                            </div>
                            <div className="alert alert-warning mt-3">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                Las cancelaciones con menos de 24 horas de anticipación pueden estar sujetas a cargos.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowCancelModal(false)}
                                disabled={isLoading}
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleCancelAppointment(appointmentToCancel.id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="me-2" spin />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                                        Confirmar Cancelación
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;