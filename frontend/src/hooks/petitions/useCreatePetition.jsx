import Swal from "sweetalert2";
import { CreatePetition } from "@services/petitions.service.js";

async function addPetitionPopup() {
    const { value: formValues } = await Swal.fire({
        title: "Añadir petición",
        html: `
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <label for="swal2-petitionTitle" style="margin-bottom: 5px;">Título</label>
                    <input id="swal2-petitionTitle" class="swal2-input" placeholder="Título de la petición">
                </div> 
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <label for="swal2-description" style="margin-bottom: 5px;">Descripción</label>
                    <textarea id="swal2-description" class="swal2-textarea" placeholder="Descripción de la petición" style="width: 100%; height: 100px;"></textarea>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Añadir",
        preConfirm: () => {
            const title = document.getElementById("swal2-petitionTitle").value.trim();
            const description = document.getElementById("swal2-description").value.trim();

            if (!title) {
                Swal.showValidationMessage("El título es obligatorio.");
                return false;
            }
            if (title.length < 3 || title.length > 50) {
                Swal.showValidationMessage("El título debe tener entre 3 y 50 caracteres.");
                return false;
            }
            if (!/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]+$/.test(title)) {
                Swal.showValidationMessage("El título solo puede contener letras, números y espacios.");
                return false;
            }

            if (!description) {
                Swal.showValidationMessage("La descripción es obligatoria.");
                return false;
            }
            if (description.length < 50 || description.length > 400) {
                Swal.showValidationMessage("La descripción debe tener entre 50 y 400 caracteres.");
                return false;
            }

            return { title, description };
        }
    });

    if (formValues) {
        return {
            title: formValues.title,
            description: formValues.description,
        };
    }
    
    return null;
}

export const useCreatePetition = (fetchPetitions) => {
    const handleCreatePetition = async () => {
        try{
            const formValues = await addPetitionPopup();
            if (!formValues) return;

            const response = await CreatePetition(formValues);
            if (response) {
                Swal.fire({
                    title: "Petición creada exitosamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
                await fetchPetitions();
            }
        }catch(error){
            console.error("Error al crear la petición:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo crear la petición.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return { handleCreatePetition };
};

export default useCreatePetition;