// API Service - Centralized HTTP client for ResiManager API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || '/v1';
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;

/**
 * Get headers for API requests
 * @param {boolean} includeAuth - Include Authorization header
 * @param {object} extraHeaders - Additional headers
 * @returns {object} Headers object
 */
const getHeaders = (includeAuth = true, extraHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...extraHeaders
    };

    if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise} Parsed JSON or error
 */
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const error = new Error(data.message || data.error || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

/**
 * Login user
 * @param {string} username - Username or email
 * @param {string} password - Password (will be Base64 encoded)
 * @returns {Promise} Login response with token and contexts
 */
export const login = async (username, password) => {
    const encodedPassword = btoa(password); // Base64 encode

    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({
            username,
            password: encodedPassword
        })
    });

    return handleResponse(response);
};

/**
 * Change user context
 * @param {object} contextData - Context to switch to (flattened structure)
 * @param {string} contextData.tipo - "ADMINISTRADORA" or "CONJUNTO"
 * @param {number} contextData.entidadId - Entity ID
 * @param {number} contextData.perfilId - Profile ID
 * @returns {Promise} New token and context info
 */
export const cambiarContexto = async (contextData) => {
    const response = await fetch(`${BASE_URL}/contexto/cambiar`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
            tipo: contextData.tipo,
            entidadId: contextData.entidadId,
            perfilId: contextData.perfilId
        })
    });

    return handleResponse(response);
};

/**
 * Get menu by profile
 * @param {number} perfilId - Profile ID
 * @returns {Promise} Menu structure
 */
export const getMenuByPerfil = async (perfilId) => {
    console.log('🍔 Calling getMenuByPerfil with perfilId:', perfilId);
    console.log('🔗 URL:', `${BASE_URL}/menu/perfil`);
    console.log('🔑 Token:', localStorage.getItem('token') ? 'Exists' : 'Missing');
    
    const response = await fetch(`${BASE_URL}/menu/perfil`, {
        method: 'GET',
        headers: getHeaders(true, {
            'X-Perfil-Id': perfilId.toString()
        })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', [...response.headers.entries()]);

    return handleResponse(response);
};

/**
 * Get all menus (deprecated - use getMenuByPerfil instead)
 * @returns {Promise} All menu items
 */
export const getAllMenus = async () => {
    const response = await fetch(`${BASE_URL}/menu`, {
        method: 'GET',
        headers: getHeaders(true)
    });

    return handleResponse(response);
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('contextosDisponibles');
    localStorage.removeItem('contextosAplanados');
    localStorage.removeItem('activeContext');
    localStorage.removeItem('activePerfilId');
    localStorage.removeItem('menu');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Get current user from localStorage
 * @returns {object|null}
 */
export const getCurrentUser = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};

/**
 * Get active context from localStorage
 * @returns {object|null}
 */
export const getActiveContext = () => {
    const context = localStorage.getItem('activeContext');
    return context ? JSON.parse(context) : null;
};

/**
 * Get available contexts from localStorage
 * @returns {Array}
 */
export const getContextosDisponibles = () => {
    const contextos = localStorage.getItem('contextosDisponibles');
    return contextos ? JSON.parse(contextos) : [];
};

export default {
    login,
    cambiarContexto,
    getMenuByPerfil,
    getAllMenus,
    logout,
    isAuthenticated,
    getCurrentUser,
    getActiveContext,
    getContextosDisponibles
};
