import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faClock, faCut, faCheck,
    faTimes, faArrowLeft, faSpinner, faInfoCircle,
    faSearch, faUserTie
} from '@fortawesome/free-solid-svg-icons';
import '../styles/BarberAppointments.css';

const BarberAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

    // Estados para la búsqueda de barberos
    const [barbers, setBarbers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBarberId, setSelectedBarberId] = useState(null);
    const [selectedBarberName, setSelectedBarberName] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Cargar lista de barberos al iniciar
    useEffect(() => {
        fetchBarbers();
    }, []);

    // Obtener la lista de barberos
    const fetchBarbers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/hh/barbero', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar la lista de barberos');
            }

            const data = await response.json();
            console.log('Barberos obtenidos:', data);
            setBarbers(data);
        } catch (err) {
            console.error('Error fetching barbers:', err);
            setError('No se pudo cargar la lista de barberos. Intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar barberos según término de búsqueda
    const filteredBarbers = barbers.filter(barber => {
        if (!searchTerm.trim()) return false;

        const fullName = `${barber.nombreBarbero} ${barber.apellidoBarbero}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Obtener citas de un barbero específico
    const fetchAppointmentsByBarberId = useCallback(async (barberId) => {
        if (!barberId) return;

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            // Construir la URL con el ID del barbero
            const response = await fetch(`http://localhost:8080/api/appointments/barber-citas?barberId=${barberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Para debugging
            console.log(`Consultando citas del barbero ID: ${barberId}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Error al cargar las citas del barbero');
            }

            // Verificar si la respuesta está vacía
            const responseText = await response.text();
            if (!responseText.trim()) {
                console.log('Respuesta vacía del servidor');
                setAppointments([]);
                return;
            }

            // Parsear la respuesta JSON
            const data = JSON.parse(responseText);
            console.log('Citas obtenidas:', data);

            // Adaptar datos al formato esperado por el componente
            const formattedAppointments = Array.isArray(data) ? data.map(cita => ({
                id: cita.idCita,
                date: cita.fechaHora,
                status: cita.estado?.toLowerCase() || 'pending',
                client: {
                    name: cita.nombreCliente || 'Cliente'
                },
                service: {
                    name: cita.nombreServicio || 'Servicio',
                    duration: cita.duracionServicio || 30,
                    price: cita.precioServicio || 0
                },
                notes: cita.notas || ''
            })) : [];

            setAppointments(formattedAppointments);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(`No se pudieron cargar las citas: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Seleccionar un barbero y cargar sus citas
    const handleSelectBarber = (barber) => {
        setSelectedBarberId(barber.idBarbero);
        setSelectedBarberName(`${barber.nombreBarbero} ${barber.apellidoBarbero}`);
        setSearchTerm('');
        setIsSearching(false);
        fetchAppointmentsByBarberId(barber.idBarbero);
    };

    // Manejar cambios en la búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsSearching(e.target.value.trim() !== '');
    };

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');

            // Incluir el ID y el status en el cuerpo de la solicitud
            const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/status/${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Error al actualizar el estado de la cita');
            }

            // Intentar leer la respuesta (si hay alguna)
            const responseData = await response.text();
            console.log('Respuesta del servidor:', responseData ? JSON.parse(responseData) : 'Sin datos');

            // Actualizar la interfaz después de confirmar éxito
            setAppointments(appointments.map(appointment =>
                appointment.id === appointmentId
                    ? { ...appointment, status: newStatus }
                    : appointment
            ));

            const statusText = newStatus === 'completed' ? 'completada' :
                newStatus === 'cancelled' ? 'cancelada' :
                    'actualizada';

            setSuccess(`La cita ha sido ${statusText} exitosamente`);

            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating appointment status:', err);
            setError(`Error al actualizar el estado de la cita: ${err.message}`);
            // Recargar citas para asegurar consistencia
            if (selectedBarberId) fetchAppointmentsByBarberId(selectedBarberId);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filter === 'all') return true;
        return appointment.status === filter;
    });

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
                    <h2 className="my-appointments-title">Citas por Barbero</h2>
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

            {/* Barra de búsqueda de barberos */}
            <div className="search-container mb-4">
                <div className="input-group">
                    <span className="input-group-text bg-dark text-light border-0">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-0"
                        placeholder="Buscar barbero por nombre..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Resultados de búsqueda */}
                {isSearching && (
                    <div className="search-results">
                        {filteredBarbers.length === 0 ? (
                            <div className="search-result-item no-results">
                                No se encontraron barberos con ese nombre
                            </div>
                        ) : (
                            filteredBarbers.map(barber => (
                                <div
                                    key={barber.idBarbero}
                                    className="search-result-item"
                                    onClick={() => handleSelectBarber(barber)}
                                >
                                    <FontAwesomeIcon icon={faUserTie} className="me-2" />
                                    {barber.nombreBarbero} {barber.apellidoBarbero}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Mostrar el barbero seleccionado */}
            {selectedBarberId && (
                <div className="selected-barber mb-4">
                    <h4>
                        <FontAwesomeIcon icon={faUserTie} className="me-2" />
                        Citas del barbero: {selectedBarberName}
                    </h4>
                </div>
            )}

            {selectedBarberId && (
                <div className="appointments-filter-container">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('all')}
                        >
                            Todas
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pendientes
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completadas
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('cancelled')}
                        >
                            Canceladas
                        </button>
                    </div>
                    <button
                        className="btn btn-outline-light refresh-button"
                        onClick={() => fetchAppointmentsByBarberId(selectedBarberId)}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={isLoading ? faSpinner : faCheck} className="me-2" spin={isLoading} />
                        Actualizar
                    </button>
                </div>
            )}

            {!selectedBarberId ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <FontAwesomeIcon icon={faUserTie} />
                    </div>
                    <h3>Busca un barbero para ver sus citas</h3>
                    <p>Utiliza la barra de búsqueda para encontrar un barbero y ver sus citas programadas.</p>
                </div>
            ) : (
                <div className="appointments-container">
                    {isLoading ? (
                        <div className="text-center p-5">
                            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mb-3" />
                            <p className="mt-2 text-light">Cargando citas...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <h3>No hay citas {filter !== 'all' ? `${filter === 'pending' ? 'pendientes' : filter === 'completed' ? 'completadas' : 'canceladas'}` : 'para mostrar'}</h3>
                            <p>
                                El barbero seleccionado no tiene citas {filter !== 'all' ? `${filter === 'pending' ? 'pendientes' : filter === 'completed' ? 'completadas' : 'canceladas'}` : 'registradas'}.
                            </p>
                        </div>
                    ) : (
                        <>
                            {filteredAppointments.map(appointment => (
                                <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                                    <div className="appointment-header">
                                        <div className="appointment-date">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                            {format(new Date(appointment.date), 'PPP', { locale: es })}
                                        </div>
                                        <span className={`status-badge ${appointment.status}`}>
                                            {appointment.status === 'completed' && 'Completada'}
                                            {appointment.status === 'cancelled' && 'Cancelada'}
                                            {appointment.status === 'pending' && 'Pendiente'}
                                        </span>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="appointment-service">
                                            <div className="service-icon">
                                                <FontAwesomeIcon icon={faCut} />
                                            </div>
                                            <div className="service-info">
                                                <h3>{appointment.service.name}</h3>
                                                <p className="service-duration">
                                                    <FontAwesomeIcon icon={faClock} className="me-1" />
                                                    {format(new Date(appointment.date), 'HH:mm')} - Duración: {appointment.service.duration} min
                                                </p>
                                            </div>
                                        </div>

                                        <div className="appointment-barber">
                                            <div className="barber-info">
                                                <h4>Cliente:</h4>
                                                <p>{appointment.client.name}</p>
                                            </div>
                                        </div>

                                        <div className="appointment-price">
                                            <h4>Precio:</h4>
                                            <p className="price">${appointment.service.price}</p>
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="appointment-notes">
                                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                            <span>{appointment.notes}</span>
                                        </div>
                                    )}

                                    {appointment.status === 'pending' && (
                                        <div className="appointment-actions">
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                            >
                                                <FontAwesomeIcon icon={faCheck} className="me-2" /> Completar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BarberAppointments;