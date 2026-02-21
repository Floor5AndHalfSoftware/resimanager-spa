import { useState, useEffect } from 'react';
import { getMenuByPerfil } from '../services/api';
import { useAuth } from '../context/AuthContext';

const useMenuData = () => {
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { activePerfilId, isAuthenticated, hasActiveContext } = useAuth();

    useEffect(() => {
        const fetchMenuData = async () => {
            // Don't fetch if user is not authenticated or doesn't have an active context
            if (!isAuthenticated() || !hasActiveContext() || !activePerfilId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const data = await getMenuByPerfil(activePerfilId);
                setMenuData(data);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError('Error al cargar el menú');
                setMenuData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [activePerfilId, isAuthenticated, hasActiveContext]);

    return { menuData, loading, error };
};

export default useMenuData;
