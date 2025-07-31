import { editElection } from "@services/election.service.js";
import Swal from "sweetalert2";

const useEditElection = (refreshCallback) => {
  const handleEditElection = async (eleccion) => {
    const result = await Swal.fire({
      title: "Editar Elección",
      html:
        `<input id="swal-input1" class="swal2-input" type="date" value="${eleccion.fecha}">` +
        `<input id="swal-input2" class="swal2-input" type="text" value="${eleccion.periodo}">` +
        `<label style='display:block;margin-top:10px;'>Activa: <input id="swal-input3" type="checkbox" ${eleccion.activa ? "checked" : ""}></label>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const fecha = document.getElementById("swal-input1").value;
        const periodo = Number(document.getElementById("swal-input2").value);
        const activa = document.getElementById("swal-input3").checked;

        if (!fecha || !periodo || ![3, 4].includes(periodo)) {
          Swal.showValidationMessage("Completa todos los campos correctamente");
          return false;
        }

        return { fecha, periodo, activa };
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        await editElection(eleccion.id, result.value); // ✅ ruta corregida
        Swal.fire("Elección actualizada", "", "success");
        refreshCallback(); // recarga elecciones
      } catch (error) {
        console.error("Error al editar elección:", error);
        Swal.fire("Error", "No se pudo editar la elección", "error");
      }
    }
  };

  return { handleEditElection };
};

export default useEditElection;
