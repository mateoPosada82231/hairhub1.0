import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si tenemos el código y email en sessionStorage
        const verificationCode = sessionStorage.getItem('verification_code');
        const email = sessionStorage.getItem('recovery_email');

        if (!verificationCode || !email) {
            setError('Información de verificación no encontrada');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validar que las contraseñas coincidan
        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        const verificationCode = sessionStorage.getItem('verification_code');
        const email = sessionStorage.getItem('recovery_email');

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    code: verificationCode,
                    newPassword: formData.newPassword
                })
            });

            if (response.ok) {
                setSuccess('Contraseña cambiada exitosamente');
                // Limpiar datos de sessionStorage
                sessionStorage.removeItem('verification_code');
                sessionStorage.removeItem('recovery_email');
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container change-password-container">
            <div className="logo">
                <h1>HAIRHUB</h1>
            </div>
            <h2 className="change-password-title">Cambiar Contraseña</h2>

            <div className="alert alert-info text-center mb-4">
                <i className="fas fa-info-circle me-2"></i> Ingresa tu nueva contraseña.
            </div>

            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="mb-4">
                    <label htmlFor="newPassword" className="form-label">
                        Nueva contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Ingresa tu nueva contraseña"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmNewPassword" className="form-label">
                        Confirmar nueva contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu nueva contraseña"
                        required
                    />
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

                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary change-password-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>

            <div className="change-password-footer">
                <p>Sistema de Gestión de Citas para Barbería</p>
            </div>
        </div>
    );
};

export default ChangePassword;