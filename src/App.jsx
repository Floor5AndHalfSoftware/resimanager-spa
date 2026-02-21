import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' // Import necessary components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ContextSelectorPage from "./pages/ContextSelectorPage.jsx";

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
                />
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
