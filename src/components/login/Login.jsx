import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, selectContext } = useAuth();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(username, password);
            console.log('Login response:', response);
            
            // Flatten contextos: expand each context with its profiles
            const contextosAplanados = [];
            (response.contextosDisponibles || []).forEach(contexto => {
                const entidadId = contexto.tipo === 'ADMINISTRADORA' 
                    ? contexto.administradora?.id 
                    : contexto.conjunto?.id;
                const entidadNombre = contexto.tipo === 'ADMINISTRADORA'
                    ? contexto.administradora?.nombre
                    : contexto.conjunto?.nombre;
                
                (contexto.perfilesDisponibles || []).forEach(perfil => {
                    contextosAplanados.push({
                        tipo: contexto.tipo,
                        entidadId: entidadId,
                        entidadNombre: entidadNombre,
                        perfilId: perfil.id,
                        perfilNombre: perfil.nombre
                    });
                });
            });
            
            console.log('Contextos aplanados:', contextosAplanados);
            
            // If user has multiple context+profile combinations, redirect to selector
            if (contextosAplanados.length > 1) {
                // Store flattened contexts for selector
                localStorage.setItem('contextosAplanados', JSON.stringify(contextosAplanados));
                navigate('/select-context');
            } 
            // If user has exactly one context+profile combination, auto-select it
            else if (contextosAplanados.length === 1) {
                const context = contextosAplanados[0];
                await selectContext(context);
                navigate('/dashboard');
            }
            // User has no contexts
            else {
                setError('No tienes contextos disponibles. Contacta al administrador.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <h1 className="h1"><b>Resi</b>Manager</h1>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Inicia sesión para comenzar</p>

                        {error && (
                            <div className="alert alert-danger alert-dismissible">
                                <button type="button" className="close" onClick={() => setError('')}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Usuario o Email" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Contraseña" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <div className="icheck-primary">
                                        <input 
                                            type="checkbox" 
                                            id="remember"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            disabled={loading}
                                        />
                                        <label htmlFor="remember">
                                            Recordarme
                                        </label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-block"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Ingresando...
                                            </>
                                        ) : (
                                            'Ingresar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <p className="mb-1">
                            <a href="#">Olvidé mi contraseña</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
