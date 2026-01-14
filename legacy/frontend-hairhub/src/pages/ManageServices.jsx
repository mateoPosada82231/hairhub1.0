import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { 
    faPlus, faSearch, faEdit, faTrash, 
    faSave, faTimes, faSpinner, faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ManageServices.css';

const ManageServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombreServicio: '',
        duracionEstimadaServicio: '',
        precioBaseServicio: ''
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/services', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los servicios');
            }

            const data = await response.json();
            setServices(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const url = editingService 
                ? `http://localhost:8080/api/services/${editingService.idServicio}`
                : 'http://localhost:8080/api/services';
            
            const method = editingService ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(editingService 
                    ? 'Error al actualizar el servicio' 
                    : 'Error al crear el servicio');
            }

            setSuccess(editingService 
                ? 'Servicio actualizado con éxito' 
                : 'Servicio creado con éxito');
            
            setShowAddModal(false);
            setEditingService(null);
            setFormData({
                nombreServicio: '',
                duracionEstimadaServicio: '',
                precioBaseServicio: ''
            });
            
            fetchServices();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('¿Estás seguro que deseas eliminar este servicio?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el servicio');
            }

            setSuccess('Servicio eliminado con éxito');
            fetchServices();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            nombreServicio: service.nombreServicio,
            duracionEstimadaServicio: service.duracionEstimadaServicio,
            precioBaseServicio: service.precioBaseServicio
        });
        setShowAddModal(true);
    };

    const filteredServices = services.filter(service =>
        service.nombreServicio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-services-container">
            <div className="manage-services-header">
                    <button
                        className="btn btn-outline-light back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Volver
                    </button>
                <h2 className='manage-services-title'>Gestión de Servicios</h2>
                <div className="header-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar servicio..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                    <button
                        className="btn btn-primary add-button"
                        onClick={() => {
                            setEditingService(null);
                            setFormData({
                                nombreServicio: '',
                                duracionEstimadaServicio: '',
                                precioBaseServicio: ''
                            });
                            setShowAddModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Agregar Servicio
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            {isLoading ? (
                <div className="text-center p-5">
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Cargando...
                </div>
            ) : (
                <div className="services-table-container">
                    <table className="services-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Duración (min)</th>
                                <th>Precio Base</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map(service => (
                                <tr key={service.idServicio}>
                                    <td>{service.nombreServicio}</td>
                                    <td>{service.duracionEstimadaServicio}</td>
                                    <td>${service.precioBaseServicio.toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleEdit(service)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(service.idServicio)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para agregar/editar servicio */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingService ? 'Editar Servicio' : 'Agregar Servicio'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingService(null);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Servicio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombreServicio"
                                        value={formData.nombreServicio}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Duración Estimada (minutos)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="duracionEstimadaServicio"
                                        value={formData.duracionEstimadaServicio}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Precio Base</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="precioBaseServicio"
                                        value={formData.precioBaseServicio}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingService(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                                        ) : (
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                        )}
                                        {editingService ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices; 