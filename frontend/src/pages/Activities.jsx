import { useEffect } from "react";
import useGetActivities from "@hooks/activities/useGetActivities.jsx";
import useEditActivity from "@hooks/activities/useEditActivity.jsx";
import useCreateActivity from "@hooks/activities/useCreateActivity.jsx";
import useDeleteActivity from "@hooks/activities/useDeleteActivity";
import "@styles/activities.css";

const Activities = () => {
  const { activities, fetchActivities } = useGetActivities();
  const { handleCreateActivity } = useCreateActivity(fetchActivities);
  const { handleEditActivity } = useEditActivity(fetchActivities);
  const { handleDeleteActivity } = useDeleteActivity(fetchActivities);

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="activities-page">
      <div className="activities-table-header">
        <h2>Lista de Actividades</h2>
        {userRole === "administrador" && (
          <button
            className="activities-create"
            onClick={() => handleCreateActivity()}
          >
            Añadir actividad
          </button>
        )}
      </div>
      <div className="activities-table-container">
        <table className="activities-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha de Actividad</th>
              {userRole === "administrador" && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>
                    {activity.description !== "" ? (
                      activity.description
                    ) : (
                      <span className="no-description">(Sin descripción)</span>
                    )}
                  </td>
                  <td>{new Date(activity.date).toLocaleString()}</td>
                  {userRole === "administrador" && (
                    <td>
                      <button
                        className="edit"
                        onClick={() =>
                          handleEditActivity(activity.id, activity)
                        }
                      >
                        Editar
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay actividades disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
