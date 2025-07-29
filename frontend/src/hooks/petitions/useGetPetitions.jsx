import {useState} from 'react'
import {GetPetitionsAdmin, GetPetitionsUser} from '@services/petitions.service.js'

export const useGetPetitions = () => {
    const [petitions, setPetitions] = useState([]);
    const [error, setError] = useState(null);

    const fetchPetitions = async () => {
        try{
            const user = JSON.parse(sessionStorage.getItem("usuario"));
            const role = user?.rol;

            let data;
            if (role === "administrador") {
                data = await GetPetitionsAdmin();
            } else {
                data = await GetPetitionsUser();
            }

            if (!data || !data.data) {
                setPetitions([]);
                setError(data?.message || "No hay datos");
                return;
            }

            setPetitions(data.data);
            setError(null);
        }catch(error){
            setError("Error al conseguir la petición: " + error.message);
            setPetitions([]);
        }
    };

    return { petitions, setPetitions, fetchPetitions, error };
};

export default useGetPetitions;