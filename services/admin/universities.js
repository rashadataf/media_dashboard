import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/universities`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewUniversity = async (formData) => {
  try {
    const response = await axios.post(`${API}/universities`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateUniversity = async (_id, formData) => {
  try {
    const response = await axios.put(`${API}/universities/${_id}`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteUniversity = async (_id) => {
  try {
    const response = await axios.delete(`${API}/universities/${_id}`);
    return true;
  } catch (error) {}
};

const countriesServices = {
  fetchAll,
  createNewUniversity,
  updateUniversity,
  deleteUniversity,
};

export default countriesServices;
