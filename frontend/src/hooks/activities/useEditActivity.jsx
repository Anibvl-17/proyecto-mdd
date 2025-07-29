import { editActivity } from "../../services/activity.service";
import Swal from "sweetalert2";

async function editActivityInfo(activity) {
  // Lo siguiente es para llenar el campo de fecha
  const originalDate = new Date(activity.date);
  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
  const day = originalDate.getDate().toString().padStart(2, "0");
  const hours = originalDate.getHours().toString().padStart(2, "0");
  const minutes = originalDate.getMinutes().toString().padStart(2, "0");
  const formattedDatetime = `${year}-${month}-${day}T${hours}:${minutes}`;

  // Lo siguiente es para establecer la fecha mínima en el campo de fecha
  // Notar que se le agrega 1 día, por lo tanto la fecha mínima es mañana
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const nowYear = now.getFullYear();
  const nowMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const nowDay = now.getDate().toString().padStart(2, "0");
  const minFormattedDatetime = `${nowYear}-${nowMonth}-${nowDay}T08:00`;

  const { value: formValues } = await Swal.fire({
    title: "Editar actividad",
    html: `
    <div>
      <label for="swal2-input-title">Título de la actividad</label>
      <input id="swal2-input-title" class="swal2-input" placeholder="Título de la actividad" value="${activity.title}">
    </div>
    <div>
      <label for="swal2-input-description">Descripción de la actividad</label>
      <input id="swal2-input-description" class="swal2-input" placeholder="Descripción de la actividad" value="${activity.description}">
    </div>
    <div>
      <label for="swal2-input-date">Fecha de la actividad (Mes-Día-Año)</label>
      <input type="datetime-local" id="swal2-input-date" class="swal2-input" value="${formattedDatetime}" min="${minFormattedDatetime}">
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const title = document.getElementById("swal2-input-title").value.trim();
      const description = document
        .getElementById("swal2-input-description")
        .value.trim();
      const date = document.getElementById("swal2-input-date").value.trim();

      if (!title || !date) {
        Swal.showValidationMessage("El título y la fecha son obligatorios.");
        return false;
      }

      if (title.length < 5 || title.length > 50) {
        Swal.showValidationMessage(
          "El título debe tener entre 5 y 50 caracteres"
        );
        return false;
      }

      if (/^[0-9]+$/.test(title)) {
        Swal.showValidationMessage("El título debe contener al menos 1 letra.");
      }

      if (!/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]+$/.test(title)) {
        Swal.showValidationMessage(
          "El título solo puede contener letras y números."
        );
        return false;
      }

      if (description.length > 250) {
        Swal.showValidationMessage(
          `La descripción debe tener máximo 250 caracteres. Actualmente tiene: ${description.length}`
        );
        return false;
      }

      if (
        !/^[a-zA-Z0-9., áéíóúÁÉÍÓÚñÑ]+$/.test(description) &&
        description !== ""
      ) {
        Swal.showValidationMessage(
          "La descripción solo puede tener letras, números, puntos y comas."
        );
        return false;
      }

      const dateObject = new Date(date);
      const minDateObject = new Date(minFormattedDatetime);

      // Verifica si la fecha tiene formato válido
      if (isNaN(dateObject)) {
        Swal.showValidationMessage(
          "La fecha debe cumplir el formato Mes-Día-Año Hora:Minutos."
        );
        return false;
      }

      // Verifica si la fecha es pasada
      if (dateObject < minDateObject) {
        Swal.showValidationMessage("La fecha debe ser futura.");
        return false;
      }

      return { title, description, date };
    },
  });

  if (formValues) {
    return {
      title: formValues.title,
      description: formValues.description,
      date: new Date(formValues.date).toISOString(),
    };
  }
}

async function confirmAlert() {
  await Swal.fire({
    title: "Actividad actualizada",
    text: "La actividad se actualizó exitosamente",
    icon: "success",
    timer: 2000,
    confirmButtonText: "Aceptar",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo actualizar la actividad.",
    icon: "error",
    timer: 2000,
    confirmButtonText: "Aceptar",
  });
}

export const useEditActivity = (fetchActivities) => {
  const handleEditActivity = async (activityId, activity) => {
    try {
      const formValues = await editActivityInfo(activity);
      console.log(formValues);
      if (!formValues) return;

      const response = await editActivity(activityId, formValues);
      if (response) {
        confirmAlert();
        await fetchActivities();
      }
    } catch (error) {
      confirmError();
      console.error("Error al editar actividad:", error);
    }
  };

  return { handleEditActivity };
};

export default useEditActivity;
