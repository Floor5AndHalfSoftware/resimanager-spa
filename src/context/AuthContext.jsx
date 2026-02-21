import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [contextosDisponibles, setContextosDisponibles] = useState([]);
    const [activeContext, setActiveContext] = useState(null);
    const [activePerfilId, setActivePerfilId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = api.getCurrentUser();
            const storedContextos = api.getContextosDisponibles();
            const storedActiveContext = api.getActiveContext();
            const storedPerfilId = localStorage.getItem('activePerfilId');

            if (token && storedUser) {
                setUser(storedUser);
                setContextosDisponibles(storedContextos || []);
                setActiveContext(storedActiveContext);
                setActivePerfilId(storedPerfilId ? parseInt(storedPerfilId) : null);
            }
            
            setLoading(false);
        };

        initializeAuth();
    }, []);

    /**
     * Login function
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<object>} Login response
     */
    const login = async (username, password) => {
        try {
            const response = await api.login(username, password);

            // Store token
            localStorage.setItem('token', response.token);
            
            // Store user data
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            setUser(response.usuario);

            // Store available contexts
            const contextos = response.contextosDisponibles || [];
            localStorage.setItem('contextosDisponibles', JSON.stringify(contextos));
            setContextosDisponibles(contextos);

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    /**
     * Select and activate a context
     * @param {object} context - Context to activate
     * @returns {Promise<object>} New token and context info
     */
    const selectContext = async (context) => {
        try {
            const contextData = {
                tipo: context.tipo,
                entidadId: context.entidadId,
                perfilId: context.perfilId
            };
            
            console.log('Seleccionando contexto:', contextData);

            const response = await api.cambiarContexto(contextData);
            console.log('Respuesta cambio de contexto:', response);

            // Update token with new one that includes context
            localStorage.setItem('token', response.token);

            // Store active context
            localStorage.setItem('activeContext', JSON.stringify(context));
            setActiveContext(context);

            // Store active perfil ID
            localStorage.setItem('activePerfilId', context.perfilId.toString());
            setActivePerfilId(context.perfilId);

            return response;
        } catch (error) {
            console.error('Context switch error:', error);
            throw error;
        }
    };

    /**
     * Logout function
     */
    const logout = () => {
        api.logout();
        setUser(null);
        setContextosDisponibles([]);
        setActiveContext(null);
        setActivePerfilId(null);
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    /**
     * Check if user has an active context
     */
    const hasActiveContext = () => {
        return !!activeContext;
    };

    const value = {
        user,
        contextosDisponibles,
        activeContext,
        activePerfilId,
        loading,
        login,
        logout,
        selectContext,
        isAuthenticated,
        hasActiveContext
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
