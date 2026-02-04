import React from 'react';

const Content = ({ children }) => {
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
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
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
                                <span className="info-box-icon bg-info elevation-1"><i className="fas fa-building"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Propiedades</span>
                                    <span className="info-box-number">10</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-success elevation-1"><i className="fas fa-users"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Residentes</span>
                                    <span className="info-box-number">53</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-warning elevation-1"><i className="fas fa-file-invoice-dollar"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Facturas</span>
                                    <span className="info-box-number">23</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-exclamation-triangle"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Incidencias</span>
                                    <span className="info-box-number">5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {children}
                </div>
            </section>
        </div>
    );
};

export default Content;
