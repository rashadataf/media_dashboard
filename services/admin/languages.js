import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/languages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewLanguage = async (title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/languages`,
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

const updateLanguage = async (_id, title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/languages/${_id}`,
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

const deleteLanguage = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/languages/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const languagesServices = {
  fetchAll,
  createNewLanguage,
  updateLanguage,
  deleteLanguage,
};

export default languagesServices;
