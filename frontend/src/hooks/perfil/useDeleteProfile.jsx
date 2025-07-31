import { deleteProfile } from "@services/user.service";
import Swal from "sweetalert2";

export const useDeleteProfile = () => {
  const handleDeleteProfile = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu perfil será eliminado permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteProfile();
      if (response) {
        Swal.fire("Eliminado", "Tu perfil ha sido eliminado", "success");
        // Aquí puedes limpiar el localStorage y redirigir al login
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
      Swal.fire("Error", "No se pudo eliminar el perfil", "error");
    }
  };

  return { handleDeleteProfile };
};

export default useDeleteProfile;
