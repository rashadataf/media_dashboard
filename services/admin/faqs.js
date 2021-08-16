import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/faqs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewFAQ = async (question, arQuestion, answer, arAnswer) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API}/faqs`,
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

const updateFAQ = async (_id, question, arQuestion, answer, arAnswer) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API}/faqs/${_id}`,
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

const deleteFAQ = async (_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API}/faqs/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {}
};

const FAQsServices = {
  fetchAll,
  createNewFAQ,
  updateFAQ,
  deleteFAQ,
};

export default FAQsServices;
