import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faSpinner, faSearch,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ManageBarbers.css';

const ManageBarbers = () => {
    const navigate = useNavigate();
    const [barbers, setBarbers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBarbers();
    }, []);

    const fetchBarbers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/hh/barbero', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los barberos');
            }

            const data = await response.json();
            setBarbers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBarbers = barbers.filter(barber => {
        const fullName = `${barber.nombreBarbero} ${barber.apellidoBarbero}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="manage-barbers-container">
            <div className="manage-barbers-header">
                <div className="d-flex align-items-center">
                    <button 
                        className="btn btn-outline-light back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Volver
                    </button>
                    <h2 className="manage-barbers-title">Lista de Barberos</h2>
                </div>
                <div className="header-actions">
                    <div className="search-container">
                        <FontAwesomeIcon icon={faSearch} className="search-icon-left" />
                        <input
                            type="text"
                            placeholder="Buscar barbero..."
                            className="form-control search-input"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Mensaje informativo */}
            <div style={{ color: 'white' }} className="alert alert-info mb-4" role="alert">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Para realizar modificaciones en la lista de barberos, por favor diríjase al apartado de <strong>Asignación de Roles</strong>.
                <button 
                    className="btn btn-link"
                    onClick={() => navigate('/assign-roles')}
                >
                    Ir a Asignación de Roles
                </button>
            </div>

            {isLoading ? (
                <div className="text-center p-5">
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Cargando...
                </div>
            ) : (
                <div className="barbers-table-container">
                    <table className="barbers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBarbers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">No se encontraron barberos</td>
                                </tr>
                            ) : (
                                filteredBarbers.map(barber => (
                                    <tr key={barber.idBarbero}>
                                        <td>{barber.idBarbero}</td>
                                        <td>{barber.nombreBarbero}</td>
                                        <td>{barber.apellidoBarbero}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBarbers;