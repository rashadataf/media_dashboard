import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/public-questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewPublicQuestion = async (
  question,
  arQuestion,
  answer,
  arAnswer
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/public-questions`,
      { question, arQuestion, answer, arAnswer },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updatePublicQuestion = async (
  _id,
  question,
  arQuestion,
  answer,
  arAnswer
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/public-questions/${_id}`,
      { question, arQuestion, answer, arAnswer },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deletePublicQuestion = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/public-questions/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const publicQuestionsServices = {
  fetchAll,
  createNewPublicQuestion,
  updatePublicQuestion,
  deletePublicQuestion,
};

export default publicQuestionsServices;
