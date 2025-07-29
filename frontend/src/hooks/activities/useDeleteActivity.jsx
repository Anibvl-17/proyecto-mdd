import Swal from "sweetalert2";
import { deleteActivity } from "@services/activity.service";

async function confirmDeleteActivity() {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Actividad eliminado",
    text: "La actividad ha sido eliminada correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar la actividad.",
    icon: "error",
    confirmButtonText: "Aceptar"
  })
}

export const useDeleteActivity = (fetchActivities) => {
  const handleDeleteActivity = async (activityId) => {
    try {
      const isConfirmed = await confirmDeleteActivity();
      if (isConfirmed) {
        const response = await deleteActivity(activityId);  
        if (response) {
          confirmAlert();
          await fetchActivities();
        }
      }
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      confirmError();
    }
  }

  return { handleDeleteActivity }
}

export default useDeleteActivity;