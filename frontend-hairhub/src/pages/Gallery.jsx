import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTimes,
  faCut,
  faPlus,
  faUpload,
  faCheck,
  faTrash,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Gallery.css';

// Importar todas las imágenes
import fadeClasico from '../images/haircuts/fade-clasico.jpg';
import pompadour from '../images/haircuts/pompadour.jpg';
import undercut from '../images/haircuts/undercut.jpg';
import buzzCut from '../images/haircuts/buzzcut.jpg';
import crewCut from '../images/haircuts/crewcut.jpg';
import combOver from '../images/haircuts/combover.jpg';
import quiff from '../images/haircuts/quiff.jpg';
import flatTop from '../images/haircuts/flattop.jpg';
import taper from '../images/haircuts/taper.jpg';
import slickBack from '../images/haircuts/slickback.jpg';

const Gallery = () => {
  const [selectedHaircut, setSelectedHaircut] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [haircutToDelete, setHaircutToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [haircuts, setHaircuts] = useState([
    { id: 1, name: "Fade Clásico", image: fadeClasico, description: "Degradado elegante con transición suave" },
    { id: 2, name: "Pompadour", image: pompadour, description: "Volumen en la parte superior con laterales cortos" },
    { id: 3, name: "Undercut", image: undercut, description: "Contraste entre la parte superior y los lados" },
    { id: 4, name: "Buzz Cut", image: buzzCut, description: "Corte muy corto y uniforme" },
    { id: 5, name: "Crew Cut", image: crewCut, description: "Corto en los lados con un poco más de largo arriba" },
    { id: 6, name: "Comb Over", image: combOver, description: "Peinado hacia un lado con definición" },
    { id: 7, name: "Quiff", image: quiff, description: "Elevado en la parte frontal con volumen" },
    { id: 8, name: "Flat Top", image: flatTop, description: "Parte superior plana con laterales cortos" },
    { id: 9, name: "Taper", image: taper, description: "Degradado sutil y elegante" },
    { id: 10, name: "Slick Back", image: slickBack, description: "Peinado hacia atrás con acabado brillante" }
  ]);
  
  // Estados para el modal de añadir corte
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHaircut, setNewHaircut] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Comprobar si el usuario es administrador al cargar el componente
  useEffect(() => {
    checkIfUserIsAdmin();
  }, []);

  const checkIfUserIsAdmin = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
  
      // Decodificar el token JWT para obtener información del usuario
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      console.log('Token payload:', payload); // Útil para debugging
  
      // Verificar el rol directamente del token
      // El JWT puede tener diferentes estructuras, verificamos todas las posibilidades comunes
      if (
        // Verificar por propiedades que podrían contener el rol
        payload.rol === 'ADMIN' || 
        payload.role === 'ADMIN' ||
        // Verificar en authorities que podría ser un array de strings o un string
        (typeof payload.authorities === 'string' && payload.authorities.includes('ADMIN')) ||
        (Array.isArray(payload.authorities) && payload.authorities.some(auth => 
          typeof auth === 'string' ? auth.includes('ADMIN') : false)) ||
        // También verificar por nombre de rol estándar con prefijo ROLE_
        payload.rol === 'ROLE_ADMIN' ||
        payload.role === 'ROLE_ADMIN' ||
        (typeof payload.authorities === 'string' && payload.authorities.includes('ROLE_ADMIN')) ||
        (Array.isArray(payload.authorities) && payload.authorities.some(auth => 
          typeof auth === 'string' ? auth.includes('ROLE_ADMIN') : false))
      ) {
        console.log('Usuario es admin según el token JWT');
        setIsAdmin(true);
        return;
      }
  
      // Si no detectamos el rol admin en el token, verificamos a través de la API
      const response = await fetch(`http://localhost:8080/api/admin/search-user?email=${encodeURIComponent(payload.sub)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        console.log('Datos de usuario recibidos:', userData);
        
        // Verificar si el rol es ADMIN directamente desde los datos del usuario
        if (userData.rol && (userData.rol.nombreRol === 'ADMIN' || userData.rol.nombreRol === 'ROLE_ADMIN')) {
          console.log('Usuario es admin según datos de API');
          setIsAdmin(true);
          return;
        }
        
        // Como respaldo, verificar permisos específicos
        const permissions = userData.permisos
          ? userData.permisos
              .filter(p => p && p.permiso)
              .map(p => {
                switch(p.permiso.idPermiso) {
                  case 1: return 'manage_barbers';
                  case 2: return 'assign_roles';
                  case 3: return 'view_reports';
                  case 8: return 'manage_services';
                  default: return null;
                }
              })
              .filter(Boolean)
          : [];
        
        if (permissions.some(p => ['manage_barbers', 'assign_roles', 'view_reports', 'manage_services'].includes(p))) {
          console.log('Usuario tiene permisos de admin');
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error al verificar permisos de administrador:', error);
    }
  };
  const openModal = (haircut) => {
    setSelectedHaircut(haircut);
  };

  const openDeleteConfirm = (e, haircut) => {
    e.stopPropagation(); // Evitar que se cierre el modal principal
    setHaircutToDelete(haircut);
    setShowDeleteConfirm(true);
    setDeleteError('');
    setDeleteSuccess('');
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteHaircut = async () => {
    setIsDeleting(true);
    setDeleteError('');
    setDeleteSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // En un entorno real, realizaríamos una petición al backend
      // Ejemplo:
      // await fetch(`http://localhost:8080/api/haircuts/${haircutToDelete.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // Simulamos retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el estado local
      setHaircuts(haircuts.filter(h => h.id !== haircutToDelete.id));
      setDeleteSuccess(`El corte "${haircutToDelete.name}" ha sido eliminado correctamente`);
      
      // Cerrar los modales después de un breve retraso
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setSelectedHaircut(null); // Cerrar el modal de detalles también
      }, 2000);
    } catch (error) {
      console.error('Error al eliminar el corte:', error);
      setDeleteError(`Error al eliminar el corte: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const closeModal = () => {
    setSelectedHaircut(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setNewHaircut({
      name: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setError('');
    setSuccess('');
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Manejar la carga de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tipo de archivo
    if (!file.type.match('image.*')) {
      setError('Por favor, selecciona una imagen válida');
      return;
    }

    // Verificar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe ser menor a 2MB');
      return;
    }

    // Crear URL para previsualización
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewHaircut({
        ...newHaircut,
        image: file,
        imagePreview: reader.result
      });
    };
    reader.readAsDataURL(file);
    setError('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHaircut({
      ...newHaircut,
      [name]: value
    });
  };

  // Guardar el nuevo corte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar campos
      if (!newHaircut.name || !newHaircut.description || !newHaircut.image) {
        throw new Error('Por favor completa todos los campos e incluye una imagen');
      }

      // Preparar FormData para enviar al servidor
      const formData = new FormData();
      formData.append('name', newHaircut.name);
      formData.append('description', newHaircut.description);
      formData.append('image', newHaircut.image);

      // En un entorno de producción, aquí enviaríamos la imagen al servidor
      // Por ahora, simularemos una respuesta exitosa y añadiremos al estado local
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Añadir el nuevo corte al estado local
      const newId = Math.max(...haircuts.map(h => h.id)) + 1;
      const newHaircutAdded = {
        id: newId,
        name: newHaircut.name,
        description: newHaircut.description,
        image: newHaircut.imagePreview // Usar la previsualización como URL temporal
      };

      setHaircuts([...haircuts, newHaircutAdded]);
      setSuccess('¡Corte añadido exitosamente!');

      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        closeAddModal();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar errores de carga de imágenes
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };
  
  return (
    <div className="gallery-container">
      <div className="dashboard-content">
        <div className="gallery-header">
          <h2 className="dashboard-title">Galería de Cortes</h2>
          <div className="gallery-actions">
            {isAdmin && (
              <button className="btn btn-primary add-button me-2" onClick={openAddModal}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Añadir Corte
              </button>
            )}
            <Link to="/dashboard" className="btn btn-outline-light back-button">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Volver
            </Link>
          </div>
        </div>
        
        <div className="dashboard-grid">
          {haircuts.map(haircut => (
            <div key={haircut.id} className="dashboard-card" onClick={() => openModal(haircut)}>
              <div className="image-container">
                <img 
                  src={haircut.image} 
                  alt={haircut.name} 
                  className="dashboard-image" 
                  onError={handleImageError}
                />
                <FontAwesomeIcon icon={faCut} className="dashboard-icon fallback-icon" style={{display: 'none'}} />
              </div>
              <h3>{haircut.name}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal para ver detalles del corte */}
      {selectedHaircut && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="modal-info">
              <h2>{selectedHaircut.name}</h2>
              <div className="modal-image-container">
                <img 
                  src={selectedHaircut.image} 
                  alt={selectedHaircut.name} 
                  className="modal-image" 
                  onError={handleImageError}
                />
                <FontAwesomeIcon 
                  icon={faCut} 
                  className="modal-fallback-icon" 
                  style={{display: 'none'}} 
                />
              </div>
              <p className="modal-description">{selectedHaircut.description}</p>
              
              {/* Botón de eliminar para administradores */}
              {isAdmin && (
                <div className="mt-4 pt-2 border-top">
                  <button 
                    className="btn btn-danger delete-button"
                    onClick={(e) => openDeleteConfirm(e, selectedHaircut)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Eliminar corte
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para añadir nuevo corte (solo para administradores) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content add-haircut-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeAddModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="modal-info">
              <h2>Añadir Nuevo Corte</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="add-haircut-form">
                <div className="form-group mb-3">
                  <label htmlFor="name" className="modal-form-label">Nombre del corte</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newHaircut.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="description" className="modal-form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={newHaircut.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="image" className="modal-form-label">Imagen</label>
                  <div className="custom-file-input">
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                    <div className="file-input-container">
                      <button
                        type="button"
                        className="btn btn-outline-primary upload-btn"
                        onClick={() => document.getElementById('image').click()}
                      >
                        <FontAwesomeIcon icon={faUpload} className="me-2" />
                        Seleccionar Imagen
                      </button>
                      <span className="file-name">
                        {newHaircut.image ? newHaircut.image.name : 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {newHaircut.imagePreview && (
                  <div className="image-preview mb-4">
                    <img 
                      src={newHaircut.imagePreview} 
                      alt="Vista previa" 
                      className="preview-image" 
                    />
                  </div>
                )}
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Corte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar corte */}
      {showDeleteConfirm && haircutToDelete && (
        <div className="modal-overlay confirmation-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content delete-confirmation-modal">
            <div className="modal-info text-center">
              <div className="delete-warning-icon mb-3">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
              </div>
              
              <h3>¿Eliminar corte?</h3>
              <p className="mb-4">
                ¿Estás seguro de que deseas eliminar el corte "{haircutToDelete.name}"?<br />
                Esta acción no se puede deshacer.
              </p>
              
              {deleteError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {deleteError}
                </div>
              )}
              
              {deleteSuccess && (
                <div className="alert alert-success mb-3" role="alert">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  {deleteSuccess}
                </div>
              )}
              
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-secondary"
                  onClick={closeDeleteConfirm}
                  disabled={isDeleting || deleteSuccess}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteHaircut}
                  disabled={isDeleting || deleteSuccess}
                >
                  {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;