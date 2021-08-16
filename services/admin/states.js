import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/states`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewState = async (title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/states`,
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

const updateState = async (_id, title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/states/${_id}`,
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

const deleteState = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/states/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const statesServices = {
  fetchAll,
  createNewState,
  updateState,
  deleteState,
};

export default statesServices;
