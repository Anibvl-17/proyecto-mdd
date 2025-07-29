import { useState } from 'react';
import { getCertificate } from '@services/certificate.service.js';

export const useGetCertificate = () => {
  const [fetchedCertificate, setFetchedCertificate] = useState(null);

  const fetchCertificate = async () => {
    try {
      const data = await getCertificate();
      setFetchedCertificate(data);
    } catch (error) {
      console.error("Error obteniendo certificado:", error);
    }
  };

  return { fetchedCertificate, fetchCertificate };
};

export default useGetCertificate;
