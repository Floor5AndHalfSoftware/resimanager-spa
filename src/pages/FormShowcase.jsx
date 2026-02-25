import { useState } from 'react';

/**
 * FormShowcase - Página de demostración de componentes de formulario AdminLTE
 * Esta página muestra todos los componentes y estilos disponibles
 */
const FormShowcase = () => {
    const [demoData, setDemoData] = useState({
        basicInput: 'Texto de ejemplo',
        emailInput: '',
        passwordInput: '',
        disabledInput: 'Campo deshabilitado',
        validInput: 'dato@valido.com',
        invalidInput: 'dato-invalido',
        warningInput: 'dato-warning',
        selectBasic: '',
        selectCustom: '',
        textarea: '',
        checkbox1: false,
        checkbox2: true,
        checkboxCustom: false,
        radio1: 'option1',
    });

    return (
        <div className="content-wrapper">
            {/* Content Header */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Componentes de Formulario - AdminLTE 3</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Formularios</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        {/* Columna Izquierda */}
                        <div className="col-md-6">
                            {/* Card: Inputs Básicos */}
                            <div className="card card-primary">
                                <div className="card-header">
                                    <h3 className="card-title">Inputs Básicos</h3>
                                </div>
                                <div className="card-body">
                                    {/* Input básico */}
                                    <div className="form-group">
                                        <label htmlFor="basicInput">Input básico</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="basicInput"
                                            placeholder="Ingresa texto"
                                            value={demoData.basicInput}
                                            onChange={(e) => setDemoData({...demoData, basicInput: e.target.value})}
                                        />
                                    </div>

                                    {/* Input con icono */}
                                    <div className="form-group">
                                        <label htmlFor="emailInput">Email (con icono)</label>
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="emailInput"
                                                placeholder="ejemplo@correo.com"
                                                value={demoData.emailInput}
                                                onChange={(e) => setDemoData({...demoData, emailInput: e.target.value})}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-envelope"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input password */}
                                    <div className="form-group">
                                        <label htmlFor="passwordInput">Password (con icono)</label>
                                        <div className="input-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="passwordInput"
                                                placeholder="Contraseña"
                                                value={demoData.passwordInput}
                                                onChange={(e) => setDemoData({...demoData, passwordInput: e.target.value})}
                                            />
                                            <div className="input-group-append">
                                                <div className="input-group-text">
                                                    <span className="fas fa-lock"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input deshabilitado */}
                                    <div className="form-group">
                                        <label htmlFor="disabledInput">Input deshabilitado</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="disabledInput"
                                            placeholder="No editable"
                                            value={demoData.disabledInput}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Estados de Validación */}
                            <div className="card card-success">
                                <div className="card-header">
                                    <h3 className="card-title">Estados de Validación</h3>
                                </div>
                                <div className="card-body">
                                    {/* Input válido */}
                                    <div className="form-group">
                                        <label htmlFor="validInput">
                                            <i className="fas fa-check"></i> Input válido
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control is-valid"
                                            id="validInput"
                                            value={demoData.validInput}
                                            onChange={(e) => setDemoData({...demoData, validInput: e.target.value})}
                                        />
                                        <div className="valid-feedback d-block">
                                            ¡Perfecto! Este campo está correcto.
                                        </div>
                                    </div>

                                    {/* Input inválido */}
                                    <div className="form-group">
                                        <label htmlFor="invalidInput">
                                            <i className="far fa-times-circle"></i> Input inválido
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control is-invalid"
                                            id="invalidInput"
                                            value={demoData.invalidInput}
                                            onChange={(e) => setDemoData({...demoData, invalidInput: e.target.value})}
                                        />
                                        <div className="invalid-feedback d-block">
                                            Este campo contiene errores.
                                        </div>
                                    </div>

                                    {/* Input warning */}
                                    <div className="form-group">
                                        <label htmlFor="warningInput">
                                            <i className="far fa-bell"></i> Input con advertencia
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control is-warning"
                                            id="warningInput"
                                            value={demoData.warningInput}
                                            onChange={(e) => setDemoData({...demoData, warningInput: e.target.value})}
                                        />
                                        <div className="warning-feedback">
                                            Ten cuidado con este campo.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Checkboxes y Radios */}
                            <div className="card card-warning">
                                <div className="card-header">
                                    <h3 className="card-title">Checkboxes y Radio Buttons</h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Checkboxes Standard</label>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="checkbox1"
                                                        checked={demoData.checkbox1}
                                                        onChange={(e) => setDemoData({...demoData, checkbox1: e.target.checked})}
                                                    />
                                                    <label className="form-check-label" htmlFor="checkbox1">
                                                        Checkbox
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="checkbox2"
                                                        checked={demoData.checkbox2}
                                                        onChange={(e) => setDemoData({...demoData, checkbox2: e.target.checked})}
                                                    />
                                                    <label className="form-check-label" htmlFor="checkbox2">
                                                        Checkbox checked
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        disabled
                                                    />
                                                    <label className="form-check-label">
                                                        Checkbox disabled
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Radio Buttons Standard</label>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="radio1"
                                                        id="radio1-1"
                                                        checked={demoData.radio1 === 'option1'}
                                                        onChange={() => setDemoData({...demoData, radio1: 'option1'})}
                                                    />
                                                    <label className="form-check-label" htmlFor="radio1-1">
                                                        Radio 1
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="radio1"
                                                        id="radio1-2"
                                                        checked={demoData.radio1 === 'option2'}
                                                        onChange={() => setDemoData({...demoData, radio1: 'option2'})}
                                                    />
                                                    <label className="form-check-label" htmlFor="radio1-2">
                                                        Radio 2
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        disabled
                                                    />
                                                    <label className="form-check-label">
                                                        Radio disabled
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Controls */}
                                    <div className="form-group">
                                        <label>Checkbox Custom</label>
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="checkboxCustom"
                                                checked={demoData.checkboxCustom}
                                                onChange={(e) => setDemoData({...demoData, checkboxCustom: e.target.checked})}
                                            />
                                            <label className="custom-control-label" htmlFor="checkboxCustom">
                                                Custom Checkbox
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="col-md-6">
                            {/* Card: Selects */}
                            <div className="card card-info">
                                <div className="card-header">
                                    <h3 className="card-title">Select</h3>
                                </div>
                                <div className="card-body">
                                    {/* Select básico */}
                                    <div className="form-group">
                                        <label htmlFor="selectBasic">Select Standard</label>
                                        <select
                                            className="form-control"
                                            id="selectBasic"
                                            value={demoData.selectBasic}
                                            onChange={(e) => setDemoData({...demoData, selectBasic: e.target.value})}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="1">Opción 1</option>
                                            <option value="2">Opción 2</option>
                                            <option value="3">Opción 3</option>
                                            <option value="4">Opción 4</option>
                                        </select>
                                    </div>

                                    {/* Select custom */}
                                    <div className="form-group">
                                        <label htmlFor="selectCustom">Custom Select</label>
                                        <select
                                            className="custom-select"
                                            id="selectCustom"
                                            value={demoData.selectCustom}
                                            onChange={(e) => setDemoData({...demoData, selectCustom: e.target.value})}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="1">Opción 1</option>
                                            <option value="2">Opción 2</option>
                                            <option value="3">Opción 3</option>
                                            <option value="4">Opción 4</option>
                                        </select>
                                    </div>

                                    {/* Select disabled */}
                                    <div className="form-group">
                                        <label>Select Disabled</label>
                                        <select className="custom-select" disabled>
                                            <option>Opción deshabilitada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Textarea */}
                            <div className="card card-secondary">
                                <div className="card-header">
                                    <h3 className="card-title">Textarea</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="textarea">Textarea</label>
                                        <textarea
                                            className="form-control"
                                            id="textarea"
                                            rows="3"
                                            placeholder="Ingresa texto..."
                                            value={demoData.textarea}
                                            onChange={(e) => setDemoData({...demoData, textarea: e.target.value})}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Textarea Disabled</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Textarea deshabilitado"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Diferentes tamaños */}
                            <div className="card card-danger">
                                <div className="card-header">
                                    <h3 className="card-title">Diferentes Tamaños</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Input Grande (.form-control-lg)</label>
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Input grande"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Input Normal</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Input normal"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Input Pequeño (.form-control-sm)</label>
                                        <input
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder="Input pequeño"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Botones */}
                            <div className="card card-dark">
                                <div className="card-header">
                                    <h3 className="card-title">Botones</h3>
                                </div>
                                <div className="card-body">
                                    <button type="button" className="btn btn-primary mr-2 mb-2">
                                        <i className="fas fa-save mr-1"></i> Primary
                                    </button>
                                    <button type="button" className="btn btn-success mr-2 mb-2">
                                        <i className="fas fa-check mr-1"></i> Success
                                    </button>
                                    <button type="button" className="btn btn-warning mr-2 mb-2">
                                        <i className="fas fa-exclamation-triangle mr-1"></i> Warning
                                    </button>
                                    <button type="button" className="btn btn-danger mr-2 mb-2">
                                        <i className="fas fa-trash mr-1"></i> Danger
                                    </button>
                                    <button type="button" className="btn btn-info mr-2 mb-2">
                                        <i className="fas fa-info-circle mr-1"></i> Info
                                    </button>
                                    <button type="button" className="btn btn-default mr-2 mb-2">
                                        <i className="fas fa-times mr-1"></i> Default
                                    </button>
                                    <div className="mt-2">
                                        <button type="button" className="btn btn-primary btn-block">
                                            Botón de bloque completo
                                        </button>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                    <button type="button" className="btn btn-default float-right">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="row">
                        <div className="col-12">
                            <div className="callout callout-info">
                                <h5><i className="fas fa-info"></i> Información:</h5>
                                Todos estos componentes siguen el estándar de AdminLTE 3 y son completamente reutilizables.
                                Puedes encontrar la documentación completa en <code>src/components/forms/README.md</code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FormShowcase;
