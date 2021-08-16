import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewService = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API}/services`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateService = async (_id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API}/services/${_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteService = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/services/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const servicesServices = {
  fetchAll,
  createNewService,
  updateService,
  deleteService,
};

export default servicesServices;
