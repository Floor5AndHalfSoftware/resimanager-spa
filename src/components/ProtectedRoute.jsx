import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireContext = false }) => {
    const { isAuthenticated, hasActiveContext, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requireContext && !hasActiveContext()) {
        return <Navigate to="/select-context" replace />;
    }

    return children;
};

export default ProtectedRoute;
