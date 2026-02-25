import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { activeContext } = useAuth();

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Dashboard</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    {/* Info boxes */}
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box">
                                <span className="info-box-icon bg-info elevation-1">
                                    <i className="fas fa-building"></i>
                                </span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Propiedades</span>
                                    <span className="info-box-number">10</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-success elevation-1">
                                    <i className="fas fa-users"></i>
                                </span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Residentes</span>
                                    <span className="info-box-number">53</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-warning elevation-1">
                                    <i className="fas fa-file-invoice-dollar"></i>
                                </span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Facturas</span>
                                    <span className="info-box-number">23</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-danger elevation-1">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Incidencias</span>
                                    <span className="info-box-number">5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header border-0">
                                    <h3 className="card-title">
                                        <i className="fas fa-home mr-1"></i>
                                        Bienvenido a ResiManager
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <p className="lead">
                                        Sistema de gestión para {activeContext?.tipo === 'A' ? 'Administradoras' : 'Conjuntos Residenciales'}
                                    </p>
                                    <p>
                                        <strong>Contexto actual:</strong> {activeContext?.nombre}
                                    </p>
                                    <p className="text-muted">
                                        Utiliza el menú lateral para navegar por las diferentes funcionalidades del sistema.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
