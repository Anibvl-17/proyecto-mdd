import { createElection } from "@services/election.service.js";
import Swal from "sweetalert2";

const useCreateElection = (refreshCallback) => {
  const handleCreateElection = async () => {
    try {
      const result = await Swal.fire({
        title: "Agregar Elección",
        html:
          `<input id="swal-input1" class="swal2-input" type="date">` +
          `<input id="swal-input2" class="swal2-input" type="text" placeholder="Periodo">` +
          `<label style='display:block;margin-top:10px;'>Activa: <input id="swal-input3" type="checkbox" checked></label>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const fecha = document.getElementById("swal-input1").value;
          const periodo = Number(document.getElementById("swal-input2").value);
          const activa = document.getElementById("swal-input3").checked;

          if (!fecha || ![3, 4].includes(periodo)) {
            Swal.showValidationMessage("Completa todos los campos correctamente");
            return false;
          }

          const fechaIngresada = new Date(fecha + "T00:00:00");
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          if (fechaIngresada <= hoy) {
            Swal.showValidationMessage("La fecha debe ser futura.");
            return false;
          }

          return { fecha, periodo, activa };
        },
      });

      // ✅ Solo continúa si el usuario confirmó
      if (result.isConfirmed && result.value) {
        await createElection(result.value);
        await Swal.fire("Elección creada", "", "success");
        refreshCallback(); // recarga elecciones
      }
    } catch (error) {
      console.error("Error al crear elección:", error);
      Swal.fire("Error", "No se pudo crear la elección", "error");
    }
  };

  return { handleCreateElection };
};

export default useCreateElection;




