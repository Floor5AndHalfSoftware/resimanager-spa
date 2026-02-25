import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ContextSelector = () => {
    const { selectContext } = useAuth();
    const [contextosAplanados, setContextosAplanados] = useState([]);
    const [selectedContext, setSelectedContext] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Load flattened contexts from localStorage
        const stored = localStorage.getItem('contextosAplanados');
        if (stored) {
            setContextosAplanados(JSON.parse(stored));
        } else {
            // No contexts available, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    const handleContextSelect = (context) => {
        setSelectedContext(context);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedContext) {
            setError('Por favor selecciona un contexto');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await selectContext(selectedContext);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al activar el contexto');
        } finally {
            setLoading(false);
        }
    };

    const getContextLabel = (context) => {
        return `${context.entidadNombre} - ${context.perfilNombre}`;
    };

    // Group contexts by type
    const administradoras = contextosAplanados.filter(c => c.tipo === 'ADMINISTRADORA');
    const conjuntos = contextosAplanados.filter(c => c.tipo === 'CONJUNTO');

    if (contextosAplanados.length === 0) {
        return null; // Still loading
    }

    return (
        <div className="login-page">
            <div className="context-selector-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <img src="/resimanager-logo-form.png" alt="ResiManager" style={{maxHeight: '120px', maxWidth: '250px', width: 'auto'}} />
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Selecciona un contexto de trabajo</p>

                        {error && (
                            <div className="alert alert-danger alert-dismissible">
                                <button type="button" className="close" onClick={() => setError('')}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Contextos disponibles:</label>
                                
                                {/* Administradoras Section */}
                                {administradoras.length > 0 && (
                                    <div className="context-section">
                                        <div className="context-section-title">
                                            <i className="fas fa-building mr-2"></i>
                                            Administradoras
                                        </div>
                                        {administradoras.map((context, index) => (
                                            <div key={`admin-${index}`} className="custom-control custom-radio mb-2">
                                                <input
                                                    type="radio"
                                                    id={`context-admin-${index}`}
                                                    name="context"
                                                    className="custom-control-input"
                                                    checked={selectedContext === context}
                                                    onChange={() => handleContextSelect(context)}
                                                    disabled={loading}
                                                />
                                                <label 
                                                    className="custom-control-label" 
                                                    htmlFor={`context-admin-${index}`}
                                                >
                                                    {getContextLabel(context)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Conjuntos Section */}
                                {conjuntos.length > 0 && (
                                    <div className="context-section">
                                        <div className="context-section-title">
                                            <i className="fas fa-home mr-2"></i>
                                            Conjuntos
                                        </div>
                                        {conjuntos.map((context, index) => (
                                            <div key={`conjunto-${index}`} className="custom-control custom-radio mb-2">
                                                <input
                                                    type="radio"
                                                    id={`context-conjunto-${index}`}
                                                    name="context"
                                                    className="custom-control-input"
                                                    checked={selectedContext === context}
                                                    onChange={() => handleContextSelect(context)}
                                                    disabled={loading}
                                                />
                                                <label 
                                                    className="custom-control-label" 
                                                    htmlFor={`context-conjunto-${index}`}
                                                >
                                                    {getContextLabel(context)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={loading || !selectedContext}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Activando contexto...
                                            </>
                                        ) : (
                                            'Continuar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextSelector;
