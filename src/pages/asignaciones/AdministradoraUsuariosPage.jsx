import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdministradoraById, getAdministradoraUsuarios } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import PageLayout from '../../components/common/PageLayout';
import DataTable from '../../components/common/DataTable';

const AdministradoraUsuariosPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [administradora, setAdministradora] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const adminResponse = await getAdministradoraById(id);
      setAdministradora(adminResponse);
      const usuariosResponse = await getAdministradoraUsuarios(id);
      setUsuarios(usuariosResponse.data || []);
    } catch (error) {
      showToast(error.message || 'Error al cargar usuarios', 'error');
      if (error.status === 404) navigate('/dashboard/administradoras');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    `${u.persona.nombre} ${u.persona.apellido} ${u.persona.documento}`
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nombreCompleto',
      label: 'Nombre',
      render: (_, row) => `${row.persona.nombre} ${row.persona.apellido}`
    },
    { key: 'documento', label: 'Documento', render: (_, row) => row.persona.documento },
    { key: 'email', label: 'Email', render: (_, row) => row.persona.email },
    {
      key: 'perfiles',
      label: 'Perfiles',
      render: (perfiles) => (
        perfiles && perfiles.length > 0
          ? perfiles.map(p => <span key={p.id} className="badge badge-info mr-1">{p.nombre}</span>)
          : <span className="text-muted">Sin perfiles</span>
      )
    },
    {
      key: 'estatus',
      label: 'Estatus',
      render: (value) => (
        <span className={`badge badge-${value === 'A' ? 'success' : 'secondary'}`}>
          {value === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  const renderActions = (row) => (
    <button
      className="btn btn-sm btn-primary"
      onClick={() => navigate(`/dashboard/administradora/${id}/usuarios/${row.persona.id}/perfiles`)}
      title="Gestionar Perfiles"
    >
      <i className="fas fa-user-shield"></i>
    </button>
  );

  return (
    <PageLayout
      title={`Usuarios - ${administradora?.nombre || '...'}`}
      breadcrumbs={[
        { label: 'Administradoras', path: '/dashboard/administradoras' },
        { label: 'Usuarios' }
      ]}
      headerActions={
        <button className="btn btn-sm btn-primary" onClick={fetchData} title="Recargar">
          <i className="fas fa-sync-alt"></i> Recargar
        </button>
      }
    >
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><i className="fas fa-users mr-2"></i>Usuarios Asignados</h3>
          <div className="card-tools">
            <div className="input-group input-group-sm" style={{ width: 250 }}>
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredUsuarios}
            renderActions={renderActions}
            loading={loading}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AdministradoraUsuariosPage;
