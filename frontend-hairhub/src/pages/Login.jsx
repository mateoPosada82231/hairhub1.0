import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    React.useEffect(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                
                // Store user info if needed
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                localStorage.setItem('userRole', tokenPayload.role);

                
                // Redirect to unified dashboard
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container login-container">
            <div className="logo">
                <h1>HAIRHUB</h1>
            </div>
            <h2 className="login-title">Iniciar Sesión</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu correo electrónico"
                        required
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                    <div className="text-end mt-1">
                        <Link 
                            to="/recover-password" 
                            className="text-decoration-none small text-primary"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </div>
            </form>
            
            <div className="text-center mt-3">
                <Link to="/register" className="login-link text-decoration-none">
                    ¿No tienes una cuenta? Regístrate
                </Link>
            </div>
            
            <div className="login-footer">
                <p>Sistema de Gestión de Citas para Barbería</p>
            </div>
        </div>
    );
};

export default Login;