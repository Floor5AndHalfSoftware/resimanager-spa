import { useState, useEffect } from 'react';
import jsonMenu from './Menu.json';

const simulatedMenuJson = jsonMenu;

const useMenuData = () => {
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMenuData(simulatedMenuJson);
            } catch (err) {
                setError('Error al cargar los datos del menú');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    return { menuData, loading, error };
};

export default useMenuData;
