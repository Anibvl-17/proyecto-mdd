import { DeletePetition } from "@services/petitions.service.js";
import Swal from "sweetalert2";

async function confirmDeletePetition() {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });
    
    return result.isConfirmed;
}

export const useDeletePetition = (fetchPetitions) => {
    const handleDeletePetition = async(petitionId) => {
        try{
            const isConfirmed = await confirmDeletePetition();
            if (isConfirmed){
                const response = await DeletePetition(petitionId);
                if (response){
                    Swal.fire({
                        title: "Petición eliminada",
                        text: "La petición ha sido eliminada correctamente.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                    });
                    await fetchPetitions();
                }
            }    
        }catch(error){
            console.error("Error al eliminar la petición:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar la petición.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return {handleDeletePetition};
};

export default useDeletePetition;