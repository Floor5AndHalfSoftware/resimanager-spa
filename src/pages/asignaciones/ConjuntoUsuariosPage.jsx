import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConjuntoById, getConjuntoUsuarios } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import PageLayout from '../../components/common/PageLayout';
import DataTable from '../../components/common/DataTable';

const ConjuntoUsuariosPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conjunto, setConjunto] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const conjuntoResponse = await getConjuntoById(id);
      setConjunto(conjuntoResponse);
      const usuariosResponse = await getConjuntoUsuarios(id);
      setUsuarios(usuariosResponse.data || []);
    } catch (error) {
      showToast(error.message || 'Error al cargar usuarios', 'error');
      if (error.status === 404) navigate('/dashboard/conjuntos');
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
      key: 'estatus',
      label: 'Estatus',
      render: (_, row) => (
        <span className={`badge badge-${row.persona.estatus === 'A' ? 'success' : 'secondary'}`}>
          {row.persona.estatus === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  const renderActions = (row) => (
    <div className="btn-group">
      <button
        className="btn btn-sm btn-info"
        onClick={() => navigate(`/dashboard/conjunto/${id}/usuarios/${row.persona.id}/perfiles`)}
        title="Gestionar Perfiles"
      >
        <i className="fas fa-user-shield"></i>
      </button>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => navigate(`/dashboard/usuarios/${row.persona.id}/editar`)}
        title="Ver Usuario"
      >
        <i className="fas fa-user"></i>
      </button>
    </div>
  );

  return (
    <PageLayout
      title={`Usuarios - ${conjunto?.nombre || '...'}`}
      breadcrumbs={[
        { label: 'Conjuntos', path: '/dashboard/conjuntos' },
        { label: 'Usuarios' }
      ]}
      headerActions={
        <button className="btn btn-sm btn-success" onClick={fetchData} title="Recargar">
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

export default ConjuntoUsuariosPage;
