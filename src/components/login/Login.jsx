import React from 'react';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí podrías realizar la lógica de autenticación
        // Si la autenticación es exitosa:
        navigate('/resimanager/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>AdminLTE</h2>
                <p>Sign in to start your session</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" placeholder="Email" required/>
                        <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" required/>
                        <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
                    </div>
                    <div className="checkbox-container">
                        <input type="checkbox" id="rememberMe"/>
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>
                <div className="links">
                    <a href="/">I forgot my password</a><br/>
                    <a href="/">Register a new membership</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
