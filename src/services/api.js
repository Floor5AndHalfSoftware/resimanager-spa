// API Service - Centralized HTTP client for ResiManager API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || '/v1';
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;

/**
 * Get headers for API requests
 * Note: Token is now sent via HttpOnly cookie, so we don't include Authorization header
 * @param {object} extraHeaders - Additional headers
 * @returns {object} Headers object
 */
const getHeaders = (extraHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...extraHeaders
    };

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
        headers: getHeaders(),
        credentials: 'include', // Important: Include cookies in request
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
        headers: getHeaders(),
        credentials: 'include', // Important: Include cookies in request
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
    
    const response = await fetch(`${BASE_URL}/menu/perfil`, {
        method: 'GET',
        headers: getHeaders({
            'X-Perfil-Id': perfilId.toString()
        }),
        credentials: 'include' // Important: Include cookies in request
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
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

/**
 * Logout user - Clear session on server and localStorage
 * Calls backend to clear the HttpOnly cookie, then clears frontend state.
 * @returns {Promise} Server response
 */
export const logout = async () => {
    try {
        await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include'
        });
    } catch (e) {
        console.warn('Logout API call failed (may be offline):', e.message);
    }
    localStorage.removeItem('usuario');
    localStorage.removeItem('contextosDisponibles');
    localStorage.removeItem('contextosAplanados');
    localStorage.removeItem('activeContext');
    localStorage.removeItem('activePerfilId');
    localStorage.removeItem('menu');
};

/**
 * Check if user is authenticated
 * Note: This function is deprecated when using HttpOnly cookies.
 * Use the isAuthenticated() method from AuthContext instead (via useAuth hook).
 * The frontend cannot access HttpOnly cookies, so authentication state
 * is determined by the presence of user data in AuthContext.
 * @deprecated Use useAuth().isAuthenticated() instead
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    console.warn('api.isAuthenticated() is deprecated. Use useAuth().isAuthenticated() instead.');
    return false; // Always return false since we can't check HttpOnly cookies from JS
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

// ==================== PERFILES API ====================

/**
 * Get all profiles with filters and pagination
 * @param {object} params - Query parameters
 * @param {string} params.estatus - Filter by status (A/I)
 * @param {number} params.nivel - Filter by level (0-4)
 * @param {string} params.search - Search by name
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 25)
 * @returns {Promise} Paginated list of profiles
 */
export const getPerfiles = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.nivel !== undefined && params.nivel !== null) queryParams.append('nivel', params.nivel);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${BASE_URL}/perfiles${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

/**
 * Get profile by ID
 * @param {number} id - Profile ID
 * @returns {Promise} Profile detail with modules and permissions
 */
export const getPerfilById = async (id) => {
    const response = await fetch(`${BASE_URL}/perfiles/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

/**
 * Create new profile
 * @param {object} data - Profile data
 * @param {string} data.nombre - Profile name
 * @param {string} data.descripcion - Profile description
 * @param {number} data.nivel - Profile level (0-4)
 * @returns {Promise} Created profile
 */
export const createPerfil = async (data) => {
    const response = await fetch(`${BASE_URL}/perfiles`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include', // Important: Include cookies in request
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Update existing profile
 * @param {number} id - Profile ID
 * @param {object} data - Updated profile data
 * @param {string} data.nombre - Profile name
 * @param {string} data.descripcion - Profile description
 * @param {number} data.nivel - Profile level (0-4)
 * @param {string} data.estatus - Profile status (A/I)
 * @returns {Promise} Updated profile
 */
export const updatePerfil = async (id, data) => {
    const response = await fetch(`${BASE_URL}/perfiles/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include', // Important: Include cookies in request
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Delete profile (soft delete)
 * @param {number} id - Profile ID
 * @returns {Promise} Success message
 */
export const deletePerfil = async (id) => {
    const response = await fetch(`${BASE_URL}/perfiles/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

/**
 * Get all modules (optionally filtered by level)
 * @param {number} nivel - Filter by level (optional)
 * @returns {Promise} List of modules
 */
export const getModulos = async (nivel = null) => {
    const url = nivel !== null 
        ? `${BASE_URL}/modulos?nivel=${nivel}` 
        : `${BASE_URL}/modulos`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

/**
 * Assign modules to profile
 * @param {number} perfilId - Profile ID
 * @param {Array<number>} moduloIds - Array of module IDs to assign
 * @returns {Promise} Assignment result
 */
export const asignarModulos = async (perfilId, moduloIds) => {
    const response = await fetch(`${BASE_URL}/perfiles/${perfilId}/modulos`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include', // Important: Include cookies in request
        body: JSON.stringify({ moduloIds })
    });

    return handleResponse(response);
};

/**
 * Revoke module from profile
 * @param {number} perfilId - Profile ID
 * @param {number} moduloId - Module ID to revoke
 * @returns {Promise} Revocation result
 */
export const revocarModulo = async (perfilId, moduloId) => {
    const response = await fetch(`${BASE_URL}/perfiles/${perfilId}/modulos/${moduloId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include' // Important: Include cookies in request
    });

    return handleResponse(response);
};

// ==================== ASIGNACIÓN DE PERFILES ====================

/**
 * Get users assigned to an Administradora
 * @param {number} administradoraId - Administradora ID
 * @returns {Promise} List of users with their profiles
 */
export const getAdministradoraUsuarios = async (administradoraId) => {
    const response = await fetch(`${BASE_URL}/administradoras/${administradoraId}/usuarios`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get users assigned to a Conjunto
 * @param {number} conjuntoId - Conjunto ID
 * @returns {Promise} List of users with their profiles
 */
export const getConjuntoUsuarios = async (conjuntoId) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${conjuntoId}/usuarios`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Assign profiles to a user in an Administradora
 * @param {number} administradoraId - Administradora ID
 * @param {number} usuarioId - User ID
 * @param {object} data - { perfiles: [perfilId1, perfilId2] }
 * @returns {Promise} Assignment result
 */
export const asignarPerfilesAdministradora = async (administradoraId, usuarioId, data) => {
    const response = await fetch(`${BASE_URL}/administradoras/${administradoraId}/usuarios/${usuarioId}/perfiles`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Assign profiles to a user in a Conjunto
 * @param {number} conjuntoId - Conjunto ID
 * @param {number} usuarioId - User ID
 * @param {object} data - { perfiles: [perfilId1, perfilId2] }
 * @returns {Promise} Assignment result
 */
export const asignarPerfilesConjunto = async (conjuntoId, usuarioId, data) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${conjuntoId}/usuarios/${usuarioId}/perfiles`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Remove a profile from a user in an Administradora
 * @param {number} administradoraId - Administradora ID
 * @param {number} usuarioId - User ID
 * @param {number} perfilId - Profile ID to remove
 * @returns {Promise} Removal result
 */
export const removerPerfilAdministradora = async (administradoraId, usuarioId, perfilId) => {
    const response = await fetch(`${BASE_URL}/administradoras/${administradoraId}/usuarios/${usuarioId}/perfiles/${perfilId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Remove a profile from a user in a Conjunto
 * @param {number} conjuntoId - Conjunto ID
 * @param {number} usuarioId - User ID
 * @param {number} perfilId - Profile ID to remove
 * @returns {Promise} Removal result
 */
export const removerPerfilConjunto = async (conjuntoId, usuarioId, perfilId) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${conjuntoId}/usuarios/${usuarioId}/perfiles/${perfilId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get all profiles of a user across all contexts
 * @param {number} usuarioId - User ID
 * @returns {Promise} User profiles grouped by context
 */
export const getUsuarioPerfiles = async (usuarioId) => {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}/perfiles`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

// ==================== AUXILIARY METHODS ====================

/**
 * Get all users with filters and pagination
 * @param {object} params - Query parameters
 * @param {string} params.search - Search by name, document or email
 * @param {string} params.estatus - Filter by status (A/I)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 25)
 * @returns {Promise} Paginated list of users
 */
export const getUsuarios = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/usuarios?${queryString}` : `${BASE_URL}/usuarios`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get user by ID
 * @param {number} usuarioId - User ID
 * @returns {Promise} User details
 */
export const getUsuarioById = async (usuarioId) => {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Update user
 * @param {number} usuarioId - User ID
 * @param {object} data - Fields to update: nombre, apellido, telefono, email, estatus
 * @returns {Promise} Updated user
 */
export const updateUsuario = async (usuarioId, data) => {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Inactivate user (soft delete)
 * @param {number} usuarioId - User ID
 * @returns {Promise} Result message
 */
export const deleteUsuario = async (usuarioId) => {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get all administradoras with filters and pagination
 * @param {object} params - Query parameters: search, estatus, page, limit
 * @returns {Promise} Paginated list of administradoras
 */
export const getAdministradoras = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/administradoras?${queryString}` : `${BASE_URL}/administradoras`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get Administradora by ID
 * @param {number} administradoraId - Administradora ID
 * @returns {Promise} Administradora details
 */
export const getAdministradoraById = async (administradoraId) => {
    const response = await fetch(`${BASE_URL}/administradoras/${administradoraId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get all conjuntos with filters and pagination
 * @param {object} params - Query parameters: search, estatus, page, limit
 * @returns {Promise} Paginated list of conjuntos
 */
export const getConjuntos = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/conjuntos?${queryString}` : `${BASE_URL}/conjuntos`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get Conjunto by ID
 * @param {number} conjuntoId - Conjunto ID
 * @returns {Promise} Conjunto details
 */
export const getConjuntoById = async (conjuntoId) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${conjuntoId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Create a new conjunto
 * @param {object} data - { documento, nombre, telefono, email, persContactoId }
 * @returns {Promise} Created conjunto
 */
export const createConjunto = async (data) => {
    const response = await fetch(`${BASE_URL}/conjuntos`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Update an existing conjunto
 * @param {number} id - Conjunto ID
 * @param {object} data - { documento?, nombre?, telefono?, email?, persContactoId?, estatus? }
 * @returns {Promise} Updated conjunto
 */
export const updateConjunto = async (id, data) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Inactivate (soft-delete) a conjunto
 * @param {number} id - Conjunto ID
 * @returns {Promise} Result message
 */
export const deleteConjunto = async (id) => {
    const response = await fetch(`${BASE_URL}/conjuntos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

// ==================== PROPIETARIOS API ====================

/**
 * Get all propietarios with filters and pagination
 * @param {object} params - Query parameters: search, estatus, conjuntoId, page, limit
 * @returns {Promise} Paginated list of propietarios
 */
export const getPropietarios = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.conjuntoId) queryParams.append('conjuntoId', params.conjuntoId);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/propietarios?${queryString}` : `${BASE_URL}/propietarios`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Get propietario by composite ID (conjunto + persona)
 * @param {number} conjId - Conjunto ID
 * @param {number} perId - Persona ID
 * @returns {Promise} Propietario details
 */
export const getPropietarioById = async (conjId, perId) => {
    const response = await fetch(`${BASE_URL}/propietarios/${conjId}/${perId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

/**
 * Create a new propietario
 * @param {object} data - { conjId, perId, propiedadId, fechaDesde }
 * @returns {Promise} Created propietario
 */
export const createPropietario = async (data) => {
    const response = await fetch(`${BASE_URL}/propietarios`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Update a propietario
 * @param {number} conjId - Conjunto ID
 * @param {number} perId - Persona ID
 * @param {object} data - { propiedadId, fechaDesde, fechaHasta, estatus }
 * @returns {Promise} Updated propietario
 */
export const updatePropietario = async (conjId, perId, data) => {
    const response = await fetch(`${BASE_URL}/propietarios/${conjId}/${perId}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });

    return handleResponse(response);
};

/**
 * Inactivate a propietario (soft delete)
 * @param {number} conjId - Conjunto ID
 * @param {number} perId - Persona ID
 * @returns {Promise} Result message
 */
export const deletePropietario = async (conjId, perId) => {
    const response = await fetch(`${BASE_URL}/propietarios/${conjId}/${perId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });

    return handleResponse(response);
};

// ==================== Propiedades ====================

export const getClasesPropiedad = async () => {
    const response = await fetch(`${BASE_URL}/propiedades/clases`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const getPropiedades = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.estatus) queryParams.append('estatus', params.estatus);
    if (params.conjuntoId) queryParams.append('conjuntoId', params.conjuntoId);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/propiedades?${queryString}` : `${BASE_URL}/propiedades`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const getPropiedadById = async (id) => {
    const response = await fetch(`${BASE_URL}/propiedades/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const createPropiedad = async (data) => {
    const response = await fetch(`${BASE_URL}/propiedades`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const updatePropiedad = async (id, data) => {
    const response = await fetch(`${BASE_URL}/propiedades/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const deletePropiedad = async (id) => {
    const response = await fetch(`${BASE_URL}/propiedades/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
    });
    return handleResponse(response);
};

// ==================== DASHBOARD API ====================

/**
 * Get dashboard statistics
 * @returns {Promise} Dashboard stats with counts and mock data
 */
export const getDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });
    return handleResponse(response);
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
    getContextosDisponibles,
    // Perfiles
    getPerfiles,
    getPerfilById,
    createPerfil,
    updatePerfil,
    deletePerfil,
    getModulos,
    asignarModulos,
    revocarModulo,
    // Asignación de Perfiles
    getAdministradoraUsuarios,
    getConjuntoUsuarios,
    asignarPerfilesAdministradora,
    asignarPerfilesConjunto,
    removerPerfilAdministradora,
    removerPerfilConjunto,
    getUsuarioPerfiles,
    // Usuarios
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    // Administradoras
    getAdministradoras,
    getAdministradoraById,
    // Conjuntos
    getConjuntos,
    getConjuntoById,
    createConjunto,
    updateConjunto,
    deleteConjunto,
    // Propietarios
    getPropietarios,
    getPropietarioById,
    createPropietario,
    updatePropietario,
    deletePropietario,
    // Propiedades
    getClasesPropiedad,
    getPropiedades,
    getPropiedadById,
    createPropiedad,
    updatePropiedad,
    deletePropiedad,
    // Dashboard
    getDashboardStats
};
