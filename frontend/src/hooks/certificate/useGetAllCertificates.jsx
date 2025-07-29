import { useState } from "react";
import { getAllCertificates } from "@services/certificate.service.js";

export const useGetAllCertificates = () => {
  const [certificates, setCertificates] = useState([]);

  const fetchAllCertificates = async () => {
    try {
      const data = await getAllCertificates();
      setCertificates(data);
    } catch (error) {
      console.error("Error obteniendo certificados:", error);
    }
  };

  return { certificates, fetchAllCertificates };
};

export default useGetAllCertificates;
