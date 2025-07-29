import { useState } from 'react';
import { createCertificate } from '@services/certificate.service.js';

export const useCreateCertificate = () => {
  const [createdCertificate, setCreatedCertificate] = useState(null);

  const sendCertificate = async (formData) => {
    try {
      const data = await createCertificate(formData);   
      setCreatedCertificate(data);
      return data; // Retorna el certificado creado
    } catch (error) {
      console.error("Error creando certificado:", error);
    }
  };

  return { createdCertificate, sendCertificate };
};

export default useCreateCertificate;
