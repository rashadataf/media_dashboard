import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/agents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewAgent = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API}/agents`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateAgent = async (_id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API}/agents/${_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteAgent = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/agents/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const agentsServices = {
  fetchAll,
  createNewAgent,
  updateAgent,
  deleteAgent,
};

export default agentsServices;
