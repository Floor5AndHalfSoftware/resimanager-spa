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
        const tipo = context.tipo === 'ADMINISTRADORA' ? 'Administradora' : 'Conjunto';
        return `${tipo}: ${context.entidadNombre} - ${context.perfilNombre}`;
    };

    if (contextosAplanados.length === 0) {
        return null; // Still loading
    }

    return (
        <div className="login-box">
            <div className="card card-outline card-primary">
                <div className="card-header text-center">
                    <h1 className="h3">
                        <b>Resi</b>Manager
                    </h1>
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
                            {contextosAplanados.map((context, index) => (
                                <div key={index} className="custom-control custom-radio mb-2">
                                    <input
                                        type="radio"
                                        id={`context-${index}`}
                                        name="context"
                                        className="custom-control-input"
                                        checked={selectedContext === context}
                                        onChange={() => handleContextSelect(context)}
                                        disabled={loading}
                                    />
                                    <label 
                                        className="custom-control-label" 
                                        htmlFor={`context-${index}`}
                                    >
                                        {getContextLabel(context)}
                                    </label>
                                </div>
                            ))}
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
    );
};

export default ContextSelector;
