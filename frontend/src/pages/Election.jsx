import "@styles/Election.css";
import useGetElection from "@hooks/Election/useGetElection.jsx";
import useDeleteElection from "@hooks/Election/useDeleteElection.jsx";
import useEditElection from "@hooks/Election/useEditElection.jsx";
import useCreateElection from "@hooks/Election/useCreateElection.jsx";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import cookies from 'js-cookie';

const Election = () => {
  const { elections, fetchElection } = useGetElection();
  const { handleDeleteElection } = useDeleteElection(fetchElection);
  const { handleEditElection } = useEditElection(fetchElection);
  const { handleCreateElection } = useCreateElection(fetchElection);

  const [isAdmin, setIsAdmin] = useState(false);
  const [postulaciones, setPostulaciones] = useState([]);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) return setIsAdmin(false);
        const user = JSON.parse(userRaw);
        const userRole = user.role || user.rol;
        setIsAdmin(user && typeof userRole === "string" && (userRole === "admin" || userRole === "administrador"));
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    window.addEventListener("userChanged", checkAdmin);
    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("userChanged", checkAdmin);
    };
  }, []);

  // ✅ Solo carga elecciones si es admin
  useEffect(() => {
    if (isAdmin) {
      fetchElection();
    }
  }, [isAdmin]);

  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      fetch(`/api/candidatures?vecinoId=${user.id}`)
        .then(res => res.json())
        .then((data) => {
          setPostulaciones(data.candidaturas?.map(c => c.eleccion?.id) || []);
        });
    }
  }, [isAdmin]);

  // ✅ Corrección: no se abre modal aquí, se delega al hook
  const handleAddElection = async () => {
    await handleCreateElection();
  };

  const handleViewCandidatures = async (eleccionId) => {
    try {
      const token = cookies.get('jwt-auth') || localStorage.getItem('token');

      const res = await fetch(`/api/candidatures/eleccion/${eleccionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Error al obtener postulantes");

      const data = await res.json();
      let lista;

      if (Array.isArray(data.candidaturas) && data.candidaturas.length > 0) {
        lista = data.candidaturas
          .map(c => c.vecino?.username || c.vecino?.email || '(sin nombre)')
          .join('<br>');
      } else {
        lista = 'Sin postulantes';
      }

      Swal.fire({
        title: 'Postulantes',
        html: lista,
        icon: 'info',
      });

    } catch (error) {
      console.error("Error en handleViewCandidatures:", error);
      Swal.fire("Error", "No se pudieron cargar los postulantes", "error");
    }
  };

  return (
    <div className="election-container">
      <h2>Listado de Elecciones</h2>

      {!isAdmin && (
        <p className="info-usuario">
          Solo los administradores pueden modificar elecciones.
        </p>
      )}

      {isAdmin && (
        <button className="add-election-btn" onClick={handleAddElection}>
          Agregar elección
        </button>
      )}

      <table className="election-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Periodo</th>
            <th>Estado</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(elections) && elections.length > 0 ? (
            elections.map((e) => {
              const userRaw = localStorage.getItem('user');
              let yaPostulado = false;
              if (userRaw) {
                const _user = JSON.parse(userRaw);
                yaPostulado = postulaciones.includes(e.id);
              }
              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.fecha}</td>
                  <td>{e.periodo}</td>
                  <td>
                    <span className={e.activa ? "estado-activa" : "estado-inactiva"}>
                      {e.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  {isAdmin ? (
                    <td>
                      <button className="edit" onClick={() => handleEditElection(e)}>
                        Editar
                      </button>
                      <button className="delete" onClick={async () => {
                        const result = await Swal.fire({
                          title: "¿Eliminar elección?",
                          text: "Esta acción no se puede deshacer.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Sí, eliminar",
                          cancelButtonText: "Cancelar"
                        });
                        if (result.isConfirmed) {
                          await handleDeleteElection(e.id);
                        }
                      }} disabled={e.activa}>
                        Eliminar
                      </button>
                      <button className="ver-postulantes" onClick={() => handleViewCandidatures(e.id)}>
                        Ver postulantes
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        className={yaPostulado ? "estado-inactiva" : "estado-activa"}
                        disabled={yaPostulado}
                        onClick={async () => {
                          if (yaPostulado) return;
                          if (!userRaw) return Swal.fire('Error', 'Debes iniciar sesión', 'error');
                          const user = JSON.parse(userRaw);
                          const token = cookies.get('jwt-auth') || localStorage.getItem('token');
                          const res = await fetch('/api/candidatures', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ vecinoId: user.id, vecinoNombre: user.username, eleccionId: e.id })
                          });
                          const data = await res.json();
                          if (res.status === 201) {
                            Swal.fire('¡Postulación exitosa!', '', 'success');
                            setPostulaciones([...postulaciones, e.id]);
                          } else {
                            Swal.fire('Error', data.message || 'No se pudo postular', 'error');
                          }
                        }}
                      >
                        {yaPostulado ? 'Postulado' : 'Postularme'}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={isAdmin ? "5" : "4"}>No hay elecciones disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Election;
