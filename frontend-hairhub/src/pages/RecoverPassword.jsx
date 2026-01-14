import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RecoverPassword.css';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container recover-password-container">
            <div className="logo">
                <h1>HAIRHUB</h1>
            </div>
            <h2 className="recover-password-title">Recuperar Contraseña</h2>

            <div className="alert alert-info text-center mb-4">
                Ingresa tu correo electrónico para recibir un enlace de recuperación
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Ingresa tu correo electrónico"
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
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-3">
                <Link to="/login" className="recover-password-link">
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
};

export default RecoverPassword;