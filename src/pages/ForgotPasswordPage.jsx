import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await forgotPassword(email);
            setMessage('Si el correo existe, recibirás un enlace de restablecimiento.');
        } catch (err) {
            setError(err.message || 'No se pudo procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <img src="/resimanager-logo-form.png" alt="ResiManager" style={{ maxHeight: '120px', maxWidth: '250px', width: 'auto' }} />
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Recuperar contraseña</p>

                        {message && <div className="alert alert-info">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Ingresa tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar enlace'
                                )}
                            </button>
                        </form>

                        <div className="mt-3">
                            <p className="mb-1"><Link to="/login">Volver al inicio de sesión</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
