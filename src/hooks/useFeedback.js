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
      toast.error(data.error);
      return { success: false, error: data.error };
    }

    return data;
  } catch (error) {
    console.error("Error in getFeedback:", error);
    const errorMessage = error.response?.data?.error || "Failed to fetch feedback";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

const getRemaningFeedback = async (page, limit, search = '') => {
  try {
    // Build the URL with search parameter if provided
    let requestUrl = `${url}/remaningFeedbacks?page=${page}&limit=${limit}`;
    
    // Only add search parameter if it's not empty
    if (search !== null && search !== undefined && search.trim() !== '') {
      requestUrl += `&q=${encodeURIComponent(search.trim())}`;
    }
    
    console.log("Making request to:", requestUrl);
    
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log("Response received:", response.data);
    
    const data = response.data;
    
    if (data.error) {
      console.error("API returned error:", data.error);
      toast.error(data.error);
      return { success: false, error: data.error };
    }

    return data;
  } catch (error) {
    console.error("Error in getRemaningFeedback:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }
    const errorMessage = error.response?.data?.error || "Failed to fetch remaining feedback";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
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
      toast.error(data.error);
      return { success: false, error: data.error };
    }
    
    toast.success(data.message || "Thank you for your valuable feedback");
    return data;
  } catch (error) {
    console.error("Error in createFeedback:", error);
    const errorMessage = error.response?.data?.error || "Failed to submit feedback";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

const updateFeedback = async (feedbackData) => {
  try {
    const response = await axios.put(`${url}`, feedbackData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      toast.error(data.error);
      return { success: false, error: data.error };
    }
    
    toast.success(data.message || "Feedback updated successfully");
    return data;
  } catch (error) {
    console.error("Error in updateFeedback:", error);
    const errorMessage = error.response?.data?.error || "Failed to update feedback";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export { getFeedback, createFeedback, updateFeedback, getRemaningFeedback };