import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faPhone, faMapMarkerAlt, faClock, 
    faEnvelope, faInfoCircle, faCamera
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Information.css';

const Information = () => {
    const navigate = useNavigate();
    
    return (
        <div className="information-container">
            <div className="information-header">
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-light back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Volver
                    </button>
                    <h2 className="information-title">Información</h2>
                </div>
            </div>

            <div className="information-content">
                <div className="info-section contact-info">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                        <h3>Sobre Nosotros</h3>
                    </div>
                    <div className="section-content">
                        <p>
                            En HairHub nos dedicamos a ofrecer los mejores servicios de barbería con profesionales altamente calificados.
                            Nuestro objetivo es que te sientas a gusto y renovado con cada visita.
                        </p>
                        
                        <div className="contact-item">
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div>
                                <h4>Teléfono</h4>
                                <p>+57 300 123 4567</p>
                            </div>
                        </div>
                        
                        <div className="contact-item">
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div>
                                <h4>Correo Electrónico</h4>
                                <p>contacto@hairhub.com</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faCamera} />
                            </div>
                            <div>
                                <h4>Instagram</h4>
                                <p>@hairhub_oficial</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section schedule">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        <h3>Horarios de Atención</h3>
                    </div>
                    <div className="section-content">
                        <div className="schedule-item">
                            <div className="day">Lunes a Viernes</div>
                            <div className="hours">10:00 AM - 7:00 PM</div>
                        </div>
                        <div className="schedule-item">
                            <div className="day">Sábados</div>
                            <div className="hours">10:00 AM - 7:00 PM</div>
                        </div>
                        <div className="schedule-item">
                            <div className="day">Domingos y Festivos</div>
                            <div className="hours">Cerrado</div>
                        </div>
                    </div>
                </div>

                <div className="info-section location">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                        <h3>Ubicación</h3>
                    </div>
                    <div className="section-content">
                        <p className="address">Cl. 5a # 5-15, Chiriguana, Cesar</p>
                        <div className="map-container">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3639.3713039448794!2d-73.6021!3d9.36226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwMjEnNDQuMSJOIDczwrAzNicwNy42Ilc!5e1!3m2!1ses!2sco!4v1749677048228!5m2!1ses!2sco" 
                                width="100%" 
                                height="450" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación de HairHub"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="info-section thank-you">
                    <div className="thank-you-content">
                        <h3>¡Gracias por preferirnos!</h3>
                        <p>Agradecemos tu confianza y esperamos seguir ofreciéndote el mejor servicio de barbería.</p>
                        <button 
                            className="btn btn-primary booking-btn"
                            onClick={() => navigate('/book-appointment')}
                        >
                            Agendar una Cita
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Information;