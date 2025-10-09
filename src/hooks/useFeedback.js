import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
const url = baseUrl + "/api/feedback";

const getFeedback = async (page, limit) => {
  try {
    const response = await axios.get(`${url}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    
    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Failed to fetch feedback");
  }
};

const getRemaningFeedback = async (page, limit, search) => {
  try {
    const response = await axios.get(`${url}/remaningFeedbacks?page=${page}&limit=${limit}&q=${search}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    
    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Failed to fetch remaining feedback");
  }
};

const createFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${url}`, feedbackData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    
    toast.success(data.message || "Thank you for your valuable feedback");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Failed to submit feedback");
    throw error; // Re-throw the error so the component can handle it
  }
};

export { getFeedback, createFeedback, getRemaningFeedback };