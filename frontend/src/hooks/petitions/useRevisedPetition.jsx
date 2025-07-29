import { RevisedPetition } from "@services/petitions.service.js";
import Swal from "sweetalert2";

export const useRevisedPetition = (fetchPetitions) => {
    const handleRevisedPetition = async (petitionId) => {

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podras deshacer esta acción.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, marcar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try{
            await RevisedPetition(petitionId);
            await fetchPetitions();
            Swal.fire({
                icon: "success",
                title: "Marcada como revisada",
                text: "La petición ha sido marcada como revisada.",
                confirmButtonText: "Aceptar",
            });
        }catch(error){
            console.error("Error al marcar revisado:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo marcar la petición como revisada.",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return {handleRevisedPetition};
}

export default useRevisedPetition;