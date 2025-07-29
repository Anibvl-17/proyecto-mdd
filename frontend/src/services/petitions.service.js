import axios from '@services/root.service.js';

export async function GetPetitionsAdmin(){
    try{
        const response = await axios.get('/petitions/')
        return response.data;
    }catch(error){
        console.error("Error al obtener peticiones (administrador):", error);
    }
}

export async function GetPetitionsUser(){
    try{
        const response = await axios.get('/petitions/getUser');
        console.log(response);
        return response.data;

    }catch(error){
        console.error("Error al obtener peticiones (usuario):", error);
    }
}

export async function DeletePetition(petitionId){
    try{
        const response = await axios.delete(`/petitions/${petitionId}`);
        return response.data
    }catch(error){
        console.error("Error al eliminar la petición:", error);
    }
}

export async function EditPetition(petitionId, petitionData){
    try{
        const response = await axios.put(`/petitions/${petitionId}`, petitionData);
        return response.data;
    }catch(error){
        console.error("Error al editar la petición:", error);
    }
}

export async function RevisedPetition(petitionId){
    try{
        const response = await axios.put(`/petitions/setRevised/${petitionId}`, { revised: true});
        return response.data;
    }catch(error){
        console.error("Error al marcar como revisado: ", error);
    }
}

export async function CreatePetition(petitionData){
    try{
        const response = await axios.post(`/petitions/`, petitionData);
        return response.data;
    }catch(error){
        console.error("Error al crear la petición:", error);
    }
}