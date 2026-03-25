import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' // Import necessary components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/common/Toast';
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ContextSelectorPage from "./pages/ContextSelectorPage.jsx";
import FormShowcase from "./pages/FormShowcase.jsx";
import HomePage from "./pages/HomePage.jsx";
import GenericPage from "./pages/GenericPage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import PerfilesPage from "./pages/perfiles/PerfilesPage.jsx";
import PerfilFormPage from "./pages/perfiles/PerfilFormPage.jsx";
import PerfilDetailPage from "./pages/perfiles/PerfilDetailPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";
import AdministradoraUsuariosPage from "./pages/asignaciones/AdministradoraUsuariosPage.jsx";
import ConjuntoUsuariosPage from "./pages/asignaciones/ConjuntoUsuariosPage.jsx";
import AsignarPerfilesPage from "./pages/asignaciones/AsignarPerfilesPage.jsx";
import UsuarioPerfilesPage from "./pages/asignaciones/UsuarioPerfilesPage.jsx";

function InnerApp() {
    // const navigate = useNavigate()
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const sessionUser = getSession()
    //         if (!sessionUser) {
    //             navigate('/virtual-dojo/frontend/login')
    //         }
    //     }, SESSION_DURATION) // Verifica cada 1 minuto
    //     return () => clearInterval(interval)
    // }, [])

    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/showcase" element={<FormShowcase/>}/>
                <Route 
                    path="/select-context" 
                    element={
                        <ProtectedRoute>
                            <ContextSelectorPage/>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute requireContext={true}>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }
                >
                    {/* Default dashboard home page */}
                    <Route index element={<HomePage />} />
                    
                    {/* Perfiles routes */}
                    <Route path="perfiles" element={<PerfilesPage />} />
                    <Route path="perfiles/nuevo" element={<PerfilFormPage />} />
                    <Route path="perfiles/:id" element={<PerfilDetailPage />} />
                    <Route path="perfiles/:id/editar" element={<PerfilFormPage />} />
                    
                    {/* Usuarios */}
                    <Route path="usuarios" element={<UsuariosPage />} />
                    <Route path="usuarios/list" element={<UsuariosPage />} />
                    
                    {/* Asignación de Perfiles - Administradoras */}
                    <Route path="administradoras/:id/usuarios" element={<AdministradoraUsuariosPage />} />

                    {/* Asignación de Perfiles - Conjuntos */}
                    <Route path="conjuntos/:id/usuarios" element={<ConjuntoUsuariosPage />} />

                    {/* Gestión de perfiles por contexto (administradora o conjunto) */}
                    <Route path=":contextType/:contextId/usuarios/:usuarioId/perfiles" element={<AsignarPerfilesPage />} />
                    
                    {/* Vista Global de Perfiles de Usuario */}
                    <Route path="usuarios/:usuarioId/perfiles" element={<UsuarioPerfilesPage />} />
                    
                    {/* Specific page implementations (add more as needed) */}
                    <Route path="propiedades" element={<PropertiesPage />} />
                    <Route path="propiedad/:method" element={<PropertiesPage />} />
                    
                    {/* Generic route for controller/method pattern */}
                    <Route path=":controller/:method" element={<GenericPage />} />
                    
                    {/* Generic route for simple names */}
                    <Route path=":controller" element={<GenericPage />} />
                </Route>
            </Routes>
        </>
    )

}

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <AuthProvider>
                        <ToastContainer />
                        <InnerApp/>
                    </AuthProvider>
                </Router>
            </div>
        </>
    )
}

export default App
