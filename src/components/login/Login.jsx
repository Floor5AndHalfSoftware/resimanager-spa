import React from 'react';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí podrías realizar la lógica de autenticación
        // Si la autenticación es exitosa:
        navigate('/daat/dashboard');
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <a href="#" className="h1"><b>Resi</b>Manager</a>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email" required/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" required/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <div className="icheck-primary">
                                        <input type="checkbox" id="remember"/>
                                        <label htmlFor="remember">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                </div>
                            </div>
                        </form>
                        <p className="mb-1">
                            <a href="#">I forgot my password</a>
                        </p>
                        <p className="mb-0">
                            <a href="#" className="text-center">Register a new membership</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
