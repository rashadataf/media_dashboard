import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/blogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewBlog = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API}/blogs`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (_id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API}/blogs/${_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/blogs/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const blogsServices = {
  fetchAll,
  createNewBlog,
  updateBlog,
  deleteBlog,
};

export default blogsServices;
