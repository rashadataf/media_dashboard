import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/scholarships`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewScholarship = async (
  title,
  arTitle,
  fees,
  specialization,
  languages
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/scholarships`,
      { title, arTitle, fees, specialization, languages },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateScholarship = async (
  _id,
  title,
  arTitle,
  fees,
  specialization,
  languages
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/scholarships/${_id}`,
      { title, arTitle, fees, specialization, languages },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteScholarship = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/scholarships/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const scholarshipsServices = {
  fetchAll,
  createNewScholarship,
  updateScholarship,
  deleteScholarship,
};

export default scholarshipsServices;
