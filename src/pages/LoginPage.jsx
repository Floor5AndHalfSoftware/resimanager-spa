import { useEffect } from "react";
import Login from "../components/login/Login.jsx";

function LoginPage() {
    // AdminLTE requiere clases específicas en el body para la página de login
    useEffect(() => {
        document.body.classList.add('hold-transition', 'login-page');
        
        // Cleanup al desmontar
        return () => {
            document.body.classList.remove('hold-transition', 'login-page');
        };
    }, []);

    return (
        <Login/>
    );
}

export default LoginPage;