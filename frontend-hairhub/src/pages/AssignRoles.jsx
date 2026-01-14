import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faSearch, faCheck, faTimes, faUserCog, faCalendar,
    faUsers, faUserTie, faChartLine, faSave, faInfoCircle, faRectangleList,
    faImage, faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import '../styles/AssignRoles.css';

const AssignRoles = () => {
    const [searchEmail, setSearchEmail] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [setStats] = useState({
        admins: 0,
        barbers: 0,
        customers: 0
    });

    // Estado para manejar permisos seleccionados
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    // Estado para manejar si estamos en modo edición de permisos
    const [editingPermissions, setEditingPermissions] = useState(false);

    const navigate = useNavigate();

    // Configuración de permisos disponibles
    const availablePermissions = [
        { id: 'manage_barbers', name: 'Gestionar Barberos', icon: faUserTie, description: 'Administrar barberos y sus horarios', role: 'ADMIN' },
        { id: 'assign_roles', name: 'Asignar Roles', icon: faUserCog, description: 'Gestionar roles de usuarios', role: 'ADMIN' },
        { id: 'view_reports', name: 'Reportes', icon: faChartLine, description: 'Ver estadísticas y reportes', role: 'ADMIN' },
        { id: 'barber_appointments', name: 'Mis Citas', icon: faClipboardCheck, description: 'Ver y gestionar citas asignadas', role: 'BARBER' },
        { id: 'information', name: 'Información', icon: faInfoCircle, description: 'Ver información sobre la barbería', role: 'CUSTOMER' },
        { id: 'book_appointment', name: 'Agendar Cita', icon: faCalendar, description: 'Reservar una nueva cita', role: 'CUSTOMER' },
        { id: 'my_appointments', name: 'Mis Citas', icon: faUsers, description: 'Ver historial de citas', role: 'CUSTOMER' },
        { id: 'manage_services', name: 'Gestionar Servicios', icon: faRectangleList, description: 'Administrar servicios disponibles', role: 'ADMIN' },
        { id: 'gallery', name: 'Ver Galería', icon: faImage, description: 'Acceder a la galería de imágenes', role: 'CUSTOMER' }
    ];

    // Añadir esta función para obtener los permisos predeterminados según el rol
    const getDefaultPermissionsByRole = (role) => {
        switch (role) {
            case 'ADMIN':
                return ['manage_barbers', 'assign_roles', 'view_reports', 'gallery', 'manage_services'];
            case 'ROLE_BARBER':
                return ['barber_appointments'];
            case 'ROLE_CUSTOMER':
                return ['book_appointment', 'my_appointments', 'gallery', 'information'];
            default:
                return ['book_appointment', 'my_appointments', 'gallery', 'information'];
        }
    };

    // Nueva función para registrar un barbero - CORREGIDA
    const registerBarber = async (userData) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            // Preparar los datos del barbero con los nombres correctos de las propiedades
            const barberData = {
                nombreBarbero: userData.firstName || userData.firstNameUsuario,
                apellidoBarbero: userData.lastName || userData.lastNameUsuario
            };

            console.log('Registrando nuevo barbero:', barberData);

            // Hacer la solicitud POST al endpoint de barberos
            const response = await fetch('http://localhost:8080/hh/barbero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(barberData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log('Barbero registrado exitosamente:', result);
            return result;
        } catch (error) {
            console.error('Error al registrar barbero:', error);
            throw error;
        }
    };

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Decodificar token para debugging
        try {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Token JWT al cargar:', payload);
        } catch (e) {
            console.error('Error al decodificar token:', e);
        }
    }, []);

    // Cargar permisos iniciales del usuario logueado
    useEffect(() => {
        const loadInitialPermissions = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('No hay token de autenticación');
                    return;
                }

                // Decodificar el token para obtener el email del usuario
                const tokenParts = token.split('.');
                const payload = JSON.parse(atob(tokenParts[1]));
                const userEmail = payload.sub; // 'sub' es donde normalmente está el email en el JWT

                console.log('Email del usuario logueado:', userEmail);

                // Cargar los datos del usuario logueado
                const response = await fetch(`http://localhost:8080/api/admin/search-user?email=${encodeURIComponent(userEmail)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los datos del usuario');
                }

                const userData = await response.json();
                console.log('Datos del usuario logueado:', userData);

                // Extraer los permisos del usuario
                const userPermissions = userData.permisos
                    ? userData.permisos
                        .filter(p => p && p.permiso)
                        .map(p => {
                            // Mapear los IDs de permisos a los IDs que usa el frontend
                            switch (p.permiso.idPermiso) {
                                case 1: return 'manage_barbers';
                                case 2: return 'assign_roles';
                                case 3: return 'view_reports';
                                case 4: return 'barber_appointments';
                                case 5: return 'information';
                                case 6: return 'book_appointment';
                                case 7: return 'my_appointments';
                                case 8: return "manage_services"
                                case 9: return "gallery";
                                default: return null;
                            }
                        })
                        .filter(Boolean)
                    : [];

                console.log('Permisos del usuario logueado:', userPermissions);

                // Si no hay permisos personalizados, establecer permisos por defecto según el rol
                if (userPermissions.length === 0) {
                    const role = userData.rol ? userData.rol.nombreRol : 'CUSTOMER';
                    let defaultPermissions = [];

                    switch (role) {
                        case 'ADMIN':
                            defaultPermissions = ['manage_barbers', 'assign_roles', 'view_reports', 'gallery', 'manage_services'];
                            break;
                        case 'BARBER':
                            defaultPermissions = ['barber_appointments'];
                            break;
                        case 'CUSTOMER':
                            defaultPermissions = ['book_appointment', 'my_appointments', 'gallery', 'information'];
                            break;
                        default:
                            defaultPermissions = ['book_appointment', 'my_appointments', 'gallery', 'information'];
                    }

                    console.log('Estableciendo permisos por defecto:', defaultPermissions);
                    setSelectedPermissions(defaultPermissions);
                } else {
                    console.log('Usando permisos personalizados:', userPermissions);
                    setSelectedPermissions(userPermissions);
                }

                // Cargar estadísticas solo si el usuario tiene el permiso 'view_reports'
                if (userPermissions.includes('view_reports')) {
                    console.log('Usuario tiene permiso para ver estadísticas, cargando...');
                    try {
                        const statsResponse = await fetch('http://localhost:8080/api/admin/stats', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (statsResponse.ok) {
                            const statsData = await statsResponse.json();
                            setStats({
                                admins: statsData.adminCount || 0,
                                barbers: statsData.barberCount || 0,
                                customers: statsData.customerCount || 0
                            });
                        } else {
                            console.warn('No se pudieron cargar las estadísticas:', statsResponse.status);
                        }
                    } catch (statsError) {
                        console.error('Error al cargar estadísticas:', statsError);
                    }
                } else {
                    console.log('Usuario no tiene permiso para ver estadísticas');
                }

            } catch (error) {
                console.error('Error al cargar permisos iniciales:', error);
                setError('Error al cargar los permisos iniciales');
            }
        };

        loadInitialPermissions();
    }, []); // Se ejecuta solo al montar el componente

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmail.trim()) return;

        setIsLoading(true);
        setError('');
        setFoundUser(null);
        setSelectedPermissions([]);
        setEditingPermissions(false);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
            }

            console.log('Buscando usuario:', searchEmail);
            const response = await fetch(`http://localhost:8080/api/admin/search-user?email=${encodeURIComponent(searchEmail)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const userData = await response.json();
            console.log('Datos del usuario:', userData);

            // Extraer los permisos del usuario
            const userPermissions = userData.permisos
                ? userData.permisos
                    .filter(p => p && p.permiso)
                    .map(p => {
                        // Mapear los IDs de permisos a los IDs que usa el frontend
                        switch (p.permiso.idPermiso) {
                            case 1: return 'manage_barbers';
                            case 2: return 'assign_roles';
                            case 3: return 'view_reports';
                            case 4: return 'barber_appointments';
                            case 5: return 'information';
                            case 6: return 'book_appointment';
                            case 7: return 'my_appointments';
                            case 8: return "manage_services";
                            case 9: return "gallery";
                            default: return null;
                        }
                    })
                    .filter(Boolean)
                : [];

            console.log('Permisos del usuario:', userPermissions);

            // Adaptar la estructura del usuario
            const adaptedUser = {
                emailUsuario: userData.emailUsuario,
                firstName: userData.firstNameUsuario,
                lastName: userData.lastNameUsuario,
                phone: userData.telefonoUsuario,
                role: userData.rol ? userData.rol.nombreRol : 'CUSTOMER',
                roleId: userData.rol ? userData.rol.idRol : 1,
                permissions: userPermissions
            };

            console.log('Usuario adaptado:', adaptedUser);
            setFoundUser(adaptedUser);
            setSelectedPermissions(userPermissions);

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setFoundUser(null);
        } finally {
            setIsLoading(false);
        }
    };

        const handleRoleChange = async (newRole) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
            }
    
            // Mapeo de nombres de roles a IDs
            const roleIds = {
                'ROLE_CUSTOMER': 2,
                'ROLE_BARBER': 3,
                'ADMIN': 1
            };
    
            const roleId = roleIds[newRole];
            if (!roleId) {
                throw new Error('Rol inválido');
            }
    
            console.log('Enviando solicitud de cambio de rol:', {
                email: foundUser.emailUsuario,
                idRole: roleId
            });
    
            // Primera solicitud: actualizar el rol del usuario
            const response = await fetch('http://localhost:8080/api/admin/update-role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: foundUser.emailUsuario,
                    idRole: roleId
                })
            });
    
            if (!response.ok) {
                // Intentar obtener mensaje de error
                let errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.text();
                    if (errorData) errorMessage = errorData;
                } catch (e) {
                    console.error('Error al leer respuesta de error:', e);
                }
                throw new Error(errorMessage);
            }
    
            // Si el nuevo rol es BARBERO, registrar al usuario como barbero
            let barberMessage = '';
            if (newRole === 'ROLE_BARBER') {
                try {
                    const barberResult = await registerBarber(foundUser);
                    console.log('Usuario registrado como barbero exitosamente:', barberResult);
                    barberMessage = ' El usuario ha sido registrado en la tabla de barberos.';
                } catch (barberError) {
                    console.error('Error al registrar barbero:', barberError);
                    barberMessage = ` Nota: Hubo un problema al registrar al usuario como barbero: ${barberError.message}`;
                }
            }
    
            // Actualizar el estado del usuario con el nuevo rol
            setFoundUser(prevUser => ({
                ...prevUser,
                role: newRole,
                roleId: roleId
            }));
    
            // Actualizar los permisos seleccionados según el nuevo rol
            const defaultPermissions = getDefaultPermissionsByRole(newRole);
            console.log(`Actualizando permisos para el rol ${newRole}:`, defaultPermissions);
            setSelectedPermissions(defaultPermissions);
            setEditingPermissions(true);
    
            setSuccess(`Rol actualizado correctamente a ${
                newRole === 'ROLE_CUSTOMER' ? 'Cliente' :
                newRole === 'ROLE_BARBER' ? 'Barbero' :
                newRole === 'ADMIN' ? 'Administrador' : 'Rol desconocido'
            }.${barberMessage}`);
    
        } catch (error) {
            console.error('Error completo al cambiar rol:', error);
            setError(error.message || 'Error al actualizar el rol del usuario');
            
            // Recargar los datos del usuario en caso de error para asegurar consistencia
            setTimeout(() => {
                handleSearch({ preventDefault: () => {} });
            }, 1000);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para alternar permisos
    const togglePermission = (permissionId) => {
        setSelectedPermissions(prevPermissions => {
            if (prevPermissions.includes(permissionId)) {
                return prevPermissions.filter(id => id !== permissionId);
            } else {
                return [...prevPermissions, permissionId];
            }
        });
    };

    // Función para guardar los permisos
    const savePermissions = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            if (!foundUser || !foundUser.emailUsuario) {
                throw new Error('No hay usuario seleccionado o el email es inválido');
            }

            // Mapeo de nombres de permisos a IDs
            const permissionIds = {
                'manage_barbers': 1,
                'assign_roles': 2,
                'view_reports': 3,
                'barber_appointments': 4,
                'information': 5,
                'book_appointment': 6,
                'my_appointments': 7,
                'manage_services': 8,
                'gallery': 9
            };

            // Convertir los nombres de permisos a IDs
            const permissionIdsToSend = selectedPermissions
                .map(permName => permissionIds[permName])
                .filter(id => id !== undefined);

            console.log('Guardando permisos para:', foundUser.emailUsuario);
            console.log('Permisos seleccionados (IDs):', permissionIdsToSend);

            const response = await fetch(`http://localhost:8080/api/admin/update-permisos?email=${encodeURIComponent(foundUser.emailUsuario)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(permissionIdsToSend)
            });

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                throw new Error(`Error al actualizar permisos: ${responseText}`);
            }

            setSuccess('Permisos actualizados correctamente');
            setEditingPermissions(false);

            // Actualizar el estado local con los nuevos permisos
            setFoundUser(prevUser => ({
                ...prevUser,
                permissions: selectedPermissions
            }));

            // Recargar los datos del usuario para asegurar consistencia
            await handleSearch({ preventDefault: () => { } });

        } catch (error) {
            console.error('Error completo:', error);
            setError(error.message || 'Error al actualizar los permisos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="roles-container">
            <div className="roles-header">
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-light back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Volver
                    </button>
                    <h2 className="roles-title">Asignación de Roles y Permisos</h2>
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

            <div className="search-container1">
                <form onSubmit={handleSearch}>
                    <div className="row align-items-center">
                        <div className="col-md-9">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-light border-0">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="email"
                                    id="searchEmail"
                                    className="form-control bg-dark text-light border-0"
                                    placeholder="Buscar usuario por correo electrónico..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {foundUser && (
                <div className="user-result">
                    <h3>Usuario encontrado</h3>
                    <div className="user-info">
                        <div className="info-item">
                            <span className="info-label">Nombre</span>
                            <span className="info-value">{`${foundUser.firstName} ${foundUser.lastName}`}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{foundUser.emailUsuario}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Rol actual</span>
                            <span className="info-value">{foundUser.role === 'ROLE_CUSTOMER' ? 'CLIENTE' : foundUser.role === 'ROLE_BARBER' ? 'Barbero' : 'ADMIN'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Telefono</span>
                            <span className="info-value">{foundUser.phone}</span>
                        </div>
                    </div>

                    <div className="role-actions mb-4">
                        <h4 className="role-title">Cambiar rol</h4>
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                className={`btn ${foundUser.role === 'ROLE_CUSTOMER' ? 'btn-secondary' : 'btn-customer'}`}
                                onClick={() => handleRoleChange('ROLE_CUSTOMER')}
                                disabled={isLoading}
                            >
                                Cliente
                            </button>
                            <button
                                className={`btn ${foundUser.role === 'ROLE_BARBER' ? 'btn-secondary' : 'btn-barber'}`}
                                onClick={() => handleRoleChange('ROLE_BARBER')}
                                disabled={isLoading}
                            >
                                Barbero
                            </button>
                            <button
                                className={`btn ${foundUser.role === 'ADMIN' ? 'btn-secondary' : 'btn-admin'}`}
                                onClick={() => handleRoleChange('ADMIN')}
                                disabled={isLoading}
                            >
                                Administrador
                            </button>
                        </div>
                    </div>

                    {/* Nueva sección de permisos */}
                    <div className="permissions-section">
                        <div className="permissions-header">
                            <h4 className="permissions-title">Gestión de Permisos</h4>
                            <div className="d-flex align-items-center">
                                <button
                                    className={`btn ${editingPermissions ? 'btn-success' : 'btn-primary'}`}
                                    onClick={() => {
                                        if (editingPermissions) {
                                            savePermissions();
                                        } else {
                                            setEditingPermissions(true);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Procesando...' :
                                        editingPermissions ? (
                                            <>
                                                <FontAwesomeIcon icon={faSave} className="me-2" />
                                                Guardar Cambios
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faUserCog} className="me-2" />
                                                Editar Permisos
                                            </>
                                        )}
                                </button>
                                {editingPermissions && (
                                    <button
                                        className="btn btn-outline-secondary ms-2"
                                        onClick={() => setEditingPermissions(false)}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>

                        {editingPermissions && (
                            <div className="permissions-info alert alert-info">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                Selecciona los permisos que deseas asignar al usuario. Los permisos activos aparecen resaltados.
                            </div>
                        )}

                        <div className="permissions-grid">
                            {availablePermissions.map(permission => {
                                // Determinar si el permiso está activo
                                const isActive = editingPermissions
                                    ? selectedPermissions.includes(permission.id)
                                    : foundUser.permissions.includes(permission.id);
                                console.log('permission', permission);
                                return (
                                    <div
                                        key={permission.id}
                                        className={`permission-card ${isActive ? 'selected' : ''} ${!editingPermissions && foundUser.permissions.includes(permission.id) ? 'current' : ''
                                            }`}
                                        onClick={() => editingPermissions && togglePermission(permission.id)}
                                    >
                                        <FontAwesomeIcon icon={permission.icon} className="permission-icon" />
                                        <h3>{permission.name}</h3>
                                        <p>{permission.description}</p>
                                        {isActive && (
                                            <div className="permission-selected">
                                                <FontAwesomeIcon icon={faCheck} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignRoles;