import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/areas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewArea = async (title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/areas`,
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

const updateArea = async (_id, title, arTitle) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT fefege...",
    };
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/areas/${_id}`,
      { title, arTitle },
      {
        headers: headers,
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteArea = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/areas/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const areasServices = {
  fetchAll,
  createNewArea,
  updateArea,
  deleteArea,
};

export default areasServices;
