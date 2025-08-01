import { useEffect, useState } from "react";
import { getElections, getActiveElections } from "@services/election.service.js";

export const useGetElection = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Obtén el usuario desde localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchElection = async () => {
    try {
      setLoading(true);

      // ✅ Lógica condicional según rol
      const data =
        user?.role === "administrador"
          ? await getElections()
          : await getActiveElections();

      setElections(data);
    } catch (err) {
      console.error("Error al obtener elecciones:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchElection(); // Evita llamada si no hay usuario
  }, [storedUser]);

  return { elections, fetchElection, loading, error };
};

export default useGetElection;





