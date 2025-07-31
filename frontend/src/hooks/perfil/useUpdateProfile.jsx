import { updateProfile } from "@services/user.service";
import Swal from "sweetalert2";

export const useUpdateProfile = () => {
  const handleUpdateProfile = async (profileData) => {
    try {
      const response = await updateProfile(profileData);
      if (response) {
        Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return { handleUpdateProfile };
};

export default useUpdateProfile;
