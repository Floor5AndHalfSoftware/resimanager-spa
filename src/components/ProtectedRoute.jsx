import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireContext = false }) => {
    const { isAuthenticated, hasActiveContext } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requireContext && !hasActiveContext()) {
        return <Navigate to="/select-context" replace />;
    }

    return children;
};

export default ProtectedRoute;
