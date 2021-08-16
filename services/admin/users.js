import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewUser = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API}/users`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (_id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API}/users/${_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/users/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const usersServices = {
  fetchAll,
  createNewUser,
  updateUser,
  deleteUser,
};

export default usersServices;
