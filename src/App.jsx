import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' // Import necessary components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ContextSelectorPage from "./pages/ContextSelectorPage.jsx";
import FormShowcase from "./pages/FormShowcase.jsx";
import HomePage from "./pages/HomePage.jsx";
import GenericPage from "./pages/GenericPage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";

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
                        <InnerApp/>
                    </AuthProvider>
                </Router>
            </div>
        </>
    )
}

export default App
