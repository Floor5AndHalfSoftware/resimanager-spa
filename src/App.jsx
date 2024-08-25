import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' // Import necessary components
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

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
                <Route path="/resimanager-spa" element={<LoginPage/>}/>
                <Route path="/resimanager-spa/login" element={<LoginPage/>}/>
                <Route path="/resimanager-spa/dashboard" element={<DashboardPage/>}/>
            </Routes>
        </>
    )

}

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <InnerApp/>
                </Router>
            </div>
        </>
    )
}

export default App
