import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ok, setOk] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(token, password);
            setOk(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'No se pudo restablecer la contraseña.');
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
                        <p className="login-box-msg">Establecer nueva contraseña</p>

                        {ok ? (
                            <div className="alert alert-success">
                                Contraseña restablecida. Redirigiendo al inicio de sesión...
                            </div>
                        ) : (
                            <>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {!token && (
                                    <div className="alert alert-warning">
                                        Falta el token de restablecimiento en el enlace.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="password">Nueva contraseña</label>
                                        <div className="input-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Mínimo 8 caracteres"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={loading}
                                                required
                                                minLength={8}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-lock"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirm">Confirmar contraseña</label>
                                        <div className="input-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirm"
                                                placeholder="Repite la contraseña"
                                                value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)}
                                                disabled={loading}
                                                required
                                                minLength={8}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-lock"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={loading || !token}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Restablecer contraseña'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-3">
                                    <p className="mb-1"><Link to="/login">Volver al inicio de sesión</Link></p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
