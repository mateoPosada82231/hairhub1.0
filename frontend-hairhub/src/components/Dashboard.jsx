import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendar, faUsers, faInfoCircle, faUserTie, 
    faSignOutAlt, faUserCog, faChartLine, 
    faRectangleList, faImage, faClipboardCheck,

} from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';
import { setupAuthListeners } from '../utils/Auth';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();

    // Mover setDefaultPermissionsByRole antes del useEffect
    const setDefaultPermissionsByRole = useCallback((role) => {
        const defaultPermissions = getDefaultPermissionsByRole(role);
        console.log('Estableciendo permisos por defecto:', defaultPermissions);
        setUserPermissions(defaultPermissions);
    }, []);

    useEffect(() => {
        // Verificar autenticación al montar el componente
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const loadUserData = async () => {
            let role = 'ROLE_CUSTOMER'; // Definir role fuera del try para que esté disponible en el catch
            
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('Token decodificado:', payload);
                
                if (payload.exp * 1000 < Date.now()) {
                    console.log('Token expirado');
                    localStorage.clear();
                    navigate('/login');
                    return;
                }
                
                // Asegurarse de que el rol se establezca correctamente
                role = payload.role || 'ROLE_CUSTOMER';
                console.log('Rol del usuario:', role);
                setUserName(payload.sub);
                
                // Guardar el rol en localStorage para acceso global
                localStorage.setItem('userRole', role);
                
                // Cargar los permisos del usuario desde el backend
                const userEmail = payload.sub;
                console.log('Cargando permisos para:', userEmail);
                
                const response = await fetch(`http://localhost:8080/api/admin/search-user?email=${encodeURIComponent(userEmail)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    console.log('Datos del usuario:', userData);
                    
                    // Extraer los permisos del usuario
                    const permissions = userData.permisos
                        ? userData.permisos
                            .filter(p => p && p.permiso)
                            .map(p => {
                                // Mapear los IDs de permisos a los IDs que usa el frontend
                                switch(p.permiso.idPermiso) {
                                    case 1: return 'manage_barbers';
                                    case 2: return 'assign_roles';
                                    case 3: return 'view_reports';
                                    case 4: return 'barber_appointments';
                                    case 5: return 'information';
                                    case 6: return 'book_appointment';
                                    case 7: return 'my_appointments';
                                    case 8: return 'manage_services';
                                    case 9: return 'gallery';
                                    default: return null;
                                }
                            })
                            .filter(Boolean)
                        : [];
                    
                    console.log('Permisos del usuario:', permissions);
                    
                    // MODIFICACIÓN: Si el usuario no tiene permisos, asignarle permisos por defecto
                    if (permissions.length === 0) {
                        console.log('Usuario sin permisos. Asignando permisos por defecto.');
                        const defaultPermissions = getDefaultPermissionsByRole(role);
                        setUserPermissions(defaultPermissions);
                        
                        // Guardar los permisos por defecto en el backend
                        await saveDefaultPermissions(userEmail, defaultPermissions);
                    } else {
                        setUserPermissions(permissions);
                    }
                } else {
                    console.error('Error al cargar permisos del usuario');
                    // Si no se pueden cargar los permisos, establecer permisos por defecto según el rol
                    setDefaultPermissionsByRole(role);
                }
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
                // En caso de error, establecer permisos por defecto según el rol
                setDefaultPermissionsByRole(role);
            }
        };
        
        loadUserData();
        
        // Configurar listener para limpiar al cerrar
        const cleanup = setupAuthListeners();
        return () => cleanup();
    }, [navigate, setDefaultPermissionsByRole]);
    
    // Nueva función para obtener los permisos por defecto según el rol
    const getDefaultPermissionsByRole = (role) => {
        switch(role) {
            case 'ROLE_ADMIN':
                return ['manage_barbers', 'assign_roles', 'view_reports', 'manage_services', 'gallery'];
            case 'ROLE_BARBER':
                return ['barber_appointments'];
            case 'ROLE_CUSTOMER':
            default:
                return ['book_appointment', 'my_appointments', 'gallery', 'information'];
        }
    };

    // Nueva función para guardar los permisos por defecto en el backend
    const saveDefaultPermissions = async (email, permissions) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            // Mapeo de permisos frontend a IDs de permisos backend
            const permissionMapping = {
                'gallery': 9,
                'manage_services': 8,
                'manage_barbers': 1,
                'assign_roles': 2,
                'view_reports': 3,
                'barber_appointments': 4,
                'information': 5,
                'book_appointment': 6,
                'my_appointments': 7,
            };

            // Convertir permisos de frontend a IDs de backend
            const permissionIds = permissions.map(perm => permissionMapping[perm]).filter(id => id);

            console.log('Guardando permisos por defecto para:', email, permissionIds);

            const response = await fetch(`http://localhost:8080/api/admin/update-permisos?email=${encodeURIComponent(email)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(permissionIds)
            });

            if (!response.ok) {
                console.error('Error al guardar permisos por defecto:', response.status);
            } else {
                console.log('Permisos por defecto guardados correctamente');
            }
        } catch (error) {
            console.error('Error al guardar permisos por defecto:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    // Renderizar opciones basadas en permisos específicos
    const renderOptions = () => {
        console.log('Renderizando opciones basadas en permisos:', userPermissions);
        
        const options = [];
        
        // Opciones de administrador
        if (userPermissions.includes('manage_barbers')) {
            options.push(
                <div key="manage-barbers" className="dashboard-card" onClick={() => navigate('/manage-barbers')}>
                    <FontAwesomeIcon icon={faUserTie} className="dashboard-icon" />
                    <h3>Gestionar Barberos</h3>
                    <p>Administrar barberos y sus horarios</p>
                </div>
            );
        }
        
        if (userPermissions.includes('assign_roles')) {
            options.push(
                <div key="assign-roles" className="dashboard-card" onClick={() => navigate('/assign-roles')}>
                    <FontAwesomeIcon icon={faUserCog} className="dashboard-icon" />
                    <h3>Asignar Roles</h3>
                    <p>Gestionar roles de usuarios</p>
                </div>
            );
        }
        
        if (userPermissions.includes('view_reports')) {
            options.push(
                <div key="reports" className="dashboard-card" onClick={() => navigate('/reports')}>
                    <FontAwesomeIcon icon={faChartLine} className="dashboard-icon" />
                    <h3>Reportes</h3>
                    <p>Ver estadísticas e informes</p>
                </div>
            );
        }
        if (userPermissions.includes('manage_services')) {
            options.push(
                <div key="manage-services" className="dashboard-card" onClick={() => navigate('/manage-services')}>
                    <FontAwesomeIcon icon={faRectangleList} className="dashboard-icon" />
                    <h3>Gestionar Servicios</h3>
                    <p>Administrar servicios disponibles</p>
                </div>
            );
        }
        
        // Opciones de barbero
        if (userPermissions.includes('barber_appointments')) {
            options.push(
                <div key="barber-appointments" className="dashboard-card" onClick={() => navigate('/barber-appointments')}>
                    <FontAwesomeIcon icon={faClipboardCheck} className="dashboard-icon" />
                    <h3>Mis Citas</h3>
                    <p>Ver y gestionar citas asignadas</p>
                </div>
            );
        }
        
        if (userPermissions.includes('information')) {
            options.push(
                <div key="information" className="dashboard-card" onClick={() => navigate('/information')}>
                    <FontAwesomeIcon icon={faInfoCircle} className="dashboard-icon" />
                    <h3>Información</h3>
                    <p>Ver información sobre la barberia</p>
                </div>
            );
        }
        
        // Opciones de cliente
        if (userPermissions.includes('book_appointment')) {
            options.push(
                <div key="book-appointment" className="dashboard-card" onClick={() => navigate('/book-appointment')}>
                    <FontAwesomeIcon icon={faCalendar} className="dashboard-icon" />
                    <h3>Agendar Cita</h3>
                    <p>Reservar una nueva cita</p>
                </div>
            );
        }
        
        if (userPermissions.includes('my_appointments')) {
            options.push(
                <div key="my-appointments" className="dashboard-card" onClick={() => navigate('/my-appointments')}>
                    <FontAwesomeIcon icon={faUsers} className="dashboard-icon" />
                    <h3>Mis Citas</h3>
                    <p>Ver historial de citas</p>
                </div>
            );
        }

        if (userPermissions.includes('gallery')) {
            options.push(
                <div key="gallery" className="dashboard-card" onClick={() => navigate('/gallery')}>
                    <FontAwesomeIcon icon={faImage} className="dashboard-icon" />
                    <h3>Galería</h3>
                    <p>Ver la galería de estilos</p>
                </div>
            );
        }
        // Si no hay opciones, mostrar un mensaje
        if (options.length === 0) {
            return (
                <div className="alert alert-info">
                    No tienes permisos para acceder a ninguna funcionalidad. Por favor, contacta a un administrador.
                </div>
            );
        }

        return options;
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="dashboard-logo">
                    <h1>HAIRHUB</h1>
                </div>
                <div className="dashboard-user">
                    <span>Bienvenido, {userName}</span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
            
            <div className="dashboard-content">
                <h2 className="dashboard-title1">Panel de Control</h2>
                <div className="dashboard-grid">
                    {renderOptions()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;