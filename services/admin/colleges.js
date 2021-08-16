import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/colleges`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewCollege = async (title, arTitle) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/colleges`,
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

const updateCollege = async (_id, title, arTitle) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT fefege...",
    };
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/colleges/${_id}`,
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

const deleteCollege = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/colleges/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const collegesServices = {
  fetchAll,
  createNewCollege,
  updateCollege,
  deleteCollege,
};

export default collegesServices;
