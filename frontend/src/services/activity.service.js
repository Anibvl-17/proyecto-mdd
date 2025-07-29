import axios from "@services/root.service.js";

export async function getActivities() {
  try {
    const response = await axios.get("/activities");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las actividades", error);
  }
}

export async function createActivity(activityData) {
  try {
    const response = await axios.post("/activities", activityData);
    return response.data;
  } catch (error) {
    console.error("Error al añadir actividad:", error);
  }
}

export async function editActivity(activityId, activity) {
  try {
    const response = await axios.put(`/activities/${activityId}`, activity)
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error al editar actividad", error);
  }
}

export async function deleteActivity(activityId) {
  try {
    const response = await axios.delete(`/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar actividad", error);
  }
}