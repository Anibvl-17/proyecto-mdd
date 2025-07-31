import axios from '@services/root.service.js';

export const getCertificate = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get("/certificates", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data; // Data del documento
};

export const createCertificate = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await axios.post("/certificates", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getAllCertificates = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get("/certificates", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data; // devuelve todos los certificados
};

