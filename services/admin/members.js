import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewMember = async (formData) => {
  try {
    const response = await axios.post(`${API}/members`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateMember = async (_id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API}/members/${_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteMember = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/members/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const membersServices = {
  fetchAll,
  createNewMember,
  updateMember,
  deleteMember,
};

export default membersServices;
