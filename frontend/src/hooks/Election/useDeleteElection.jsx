import Swal from "sweetalert2";
import { deleteElection } from "@services/election.service";

export const useDeleteElection = (fetchElection) => {
  const handleDeleteElection = async (id) => {
    try {
      await deleteElection(id);
      await fetchElection();
    } catch (error) {
      console.error("Error al eliminar elección:", error);
    }
  };

  return { handleDeleteElection };
};

export default useDeleteElection;

