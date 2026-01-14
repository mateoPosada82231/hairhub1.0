import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/VerificationCode.css';

const VerificationCode = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const email = sessionStorage.getItem('recovery_email');
        if (!email) {
            navigate('/recover-password');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const email = sessionStorage.getItem('recovery_email');
        const formattedCode = code.trim().toUpperCase();

        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    code: formattedCode
                })
            });

            if (response.ok) {
                setSuccess('Código verificado correctamente');
                sessionStorage.setItem('verification_code', formattedCode);
                setTimeout(() => {
                    navigate('/change-password');
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Código inválido');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        const email = sessionStorage.getItem('recovery_email');
        if (!email) {
            setError('No se encontró el correo electrónico');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/resend-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccess('Se ha enviado un nuevo código a tu correo');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al reenviar el código');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container verification-container">
            <div className="logo">
                <h1>HAIRHUB</h1>
            </div>
            <h2 className="verification-title">Verificación de Código</h2>

            <div className="alert alert-info text-center mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Hemos enviado un código de verificación a tu correo electrónico.
            </div>

            <form onSubmit={handleSubmit} className="verification-form">
                <div className="mb-4">
                    <label htmlFor="code" className="form-label">
                        Código de verificación
                    </label>
                    <input
                        type="text"
                        className="form-control text-uppercase"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ingresa el código (Ej: C61161)"
                        required
                        maxLength="6"
                        pattern="[A-Za-z0-9]{6}"
                    />
                    <div className="form-text">
                        El código debe contener 6 caracteres alfanuméricos
                    </div>
                </div>

                <div className="mb-3 text-center">
                    <small>
                        ¿No recibiste el código?{' '}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={handleResendCode}
                        >
                            Reenviar código
                        </button>
                    </small>
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
                        className="btn btn-primary verification-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verificando...' : 'Verificar Código'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-3">
                <button
                    className="btn btn-link verification-link"
                    onClick={() => navigate('/recover-password')}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    Volver
                </button>
            </div>

            <div className="verification-footer">
                <p>Sistema de Gestión de Citas para Barbería</p>
            </div>
        </div>
    );
};

export default VerificationCode;