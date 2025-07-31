import { EditPetition } from "@services/petitions.service.js";
import Swal from "sweetalert2";

async function editPetitionAlert(currentTitle, currentDescription) {
    let petitionTitle = currentTitle;
    let petitionDescription = currentDescription;

    const { value: titleValue } = await Swal.fire({
        title: "Editar título de la petición",
        input: "text",
        inputLabel: "Título de la petición",
        inputValue: currentTitle,
        showCancelButton: true,
        preConfirm: (value) => {
            if (!value) {
                Swal.showValidationMessage("El título es obligatorio.");
                return false;
            }

            if (value && (value.length < 3 || value.length > 50)) {
                Swal.showValidationMessage("El título debe tener entre 3 y 50 caracteres.");
                return false;
            }

            if (value && !/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]+$/.test(value)) {
                Swal.showValidationMessage("El título solo puede contener letras, números y espacios.");
                return false;
            }

            return value;
        },
    });

    if (!titleValue) return null;
    petitionTitle = titleValue;

    const { value: descValue } = await Swal.fire({
        title: "Editar descripción de la petición",
        input: "text",
        inputLabel: "Descripción de la petición",
        inputValue: currentDescription,
        showCancelButton: true,
        preConfirm: (value) => {
        if (!value) {
            Swal.showValidationMessage("La descripción es obligatoria.");
            return false;
        }

        if (value.length < 50 || value.length > 400) {
            Swal.showValidationMessage("La descripción debe tener entre 50 y 400 caracteres.");
            return false;
        }

        return value;
        },
    });

    if (!descValue) return null;
    petitionDescription = descValue;

    return { title: petitionTitle, description: petitionDescription };
    }

    export const useEditPetition = (fetchPetitions) => {
    const handleEditPetition = async (petitionId, currentTitle = "", currentDescription = "", isReviewed = false) => {
        if (isReviewed){
            Swal.fire({
                icon: "warning",
                title: "No se puede editar",
                text: "La petición ya fue revisada y no puede ser editada.",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        try{
            const petitionData = await editPetitionAlert(currentTitle, currentDescription);
            if (!petitionData) return;

            const response = await EditPetition(petitionId, petitionData);
            if (response) {
                Swal.fire({
                title: "Petición editada",
                text: "La petición ha sido editada correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
                });
                await fetchPetitions();
            }
        }catch(error){
        console.error("Error al editar la petición:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo editar la petición.",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        }
    };

    return { handleEditPetition };
};

export default useEditPetition;