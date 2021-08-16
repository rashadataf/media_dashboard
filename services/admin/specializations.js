import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/specializations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewSpecialization = async (title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/specializations`,
      { title, arTitle },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateSpecialization = async (_id, title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/specializations/${_id}`,
      { title, arTitle },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteSpecialization = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/specializations/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const specializationsServices = {
  fetchAll,
  createNewSpecialization,
  updateSpecialization,
  deleteSpecialization,
};

export default specializationsServices;
