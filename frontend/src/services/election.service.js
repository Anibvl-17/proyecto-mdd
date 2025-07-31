import axios from "axios";

const API_URL = "http://localhost:3000/api/elections";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getElections = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data?.data || [];
};

export const getActiveElections = async () => {
  const response = await axios.get(`${API_URL}/active`, getAuthHeader());
  return response.data?.data || [];
};

export const createElection = async (electionData) => {
  const response = await axios.post(API_URL, electionData, getAuthHeader());
  return response.data;
};

export const editElection = async (id, electionData) => {
  const response = await axios.put(`${API_URL}/${id}`, electionData, getAuthHeader());
  return response.data;
};

export const deleteElection = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
