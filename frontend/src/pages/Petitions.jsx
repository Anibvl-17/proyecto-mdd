import "@styles/petitions.css";
import useGetPetitions from "@hooks/petitions/useGetPetitions.jsx";
import useDeletePetition from "@hooks/petitions/useDeletePetition.jsx";
import useEditPetition from "@hooks/petitions/useEditPetition.jsx";
import useCreatePetition from "@hooks/petitions/useCreatePetition.jsx";
import useRevisedPetition from "@hooks/petitions/useRevisedPetition.jsx";
import { useEffect } from "react";


const Petitions = () => {
    const {petitions, fetchPetitions} = useGetPetitions();
    const {handleDeletePetition} = useDeletePetition(fetchPetitions);
    const {handleEditPetition} = useEditPetition(fetchPetitions);
    const {handleCreatePetition} = useCreatePetition(fetchPetitions);
    const {handleRevisedPetition} = useRevisedPetition(fetchPetitions);
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    const userRole = user?.rol;
    const userRut = user?.rut;

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchPetitions();
    },[])

    return(
        <div className = "petitions-page">
            <div className="petitions-header">
                <h2>Lista de Peticiones</h2>
                <button className="petitions-addbtn" onClick={() => handleCreatePetition()}>Añadir</button>
            </div>
            
            <table className = "petitions-table">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Descripción</th>
                        <th>Revisado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(petitions) && petitions.length > 0 ? (
                        petitions.map((petition) => (
                            <tr key = {petition.id}>
                                <td>{petition.title}</td>
                                <td>{petition.description}</td>
                                <td>{petition.revised ? "Si" : "No"}</td>
                                <td>
                                    {userRole === "administrador" && !petition.revised && (
                                        <button className = "revised" onClick={() => handleRevisedPetition(petition.id, petition.revised)}>Marcar revisado</button>
                                    )}
                                    {petition.userRut === userRut &&  !petition.revised && (
                                        <>
                                            <button className="edit" onClick={() => handleEditPetition(petition.id, petition.title, petition.description, petition.revised)}>Editar</button>
                                            <button className="delete" onClick={() => handleDeletePetition(petition.id, petition.revised)}>Eliminar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay peticiones disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Petitions;