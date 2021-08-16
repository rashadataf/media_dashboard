import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/programs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewProgram = async (
  title,
  arTitle,
  years,
  normalPrice,
  discountPrice,
  scientificDegree,
  specialization,
  languages
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/programs`,
      {
        title,
        arTitle,
        years,
        normalPrice,
        discountPrice,
        scientificDegree,
        specialization,
        languages,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateProgram = async (
  _id,
  title,
  arTitle,
  years,
  normalPrice,
  discountPrice,
  scientificDegree,
  specialization,
  languages
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/programs/${_id}`,
      {
        title,
        arTitle,
        years,
        normalPrice,
        discountPrice,
        scientificDegree,
        specialization,
        languages,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteProgram = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/programs/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const programsServices = {
  fetchAll,
  createNewProgram,
  updateProgram,
  deleteProgram,
};

export default programsServices;
