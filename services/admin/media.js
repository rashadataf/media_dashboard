import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/media`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewMedia = async (formData) => {
  try {
    const response = await axios.post(`${API}/media`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateMedia = async (_id, formdata) => {
  try {
    const response = await axios.put(`${API}/media/${_id}`, formdata);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteMedia = async (_id) => {
  try {
    const response = await axios.delete(`${API}/media/${_id}`);
    return true;
  } catch (error) {}
};

const mediaServices = {
  fetchAll,
  createNewMedia,
  updateMedia,
  deleteMedia,
};

export default mediaServices;
