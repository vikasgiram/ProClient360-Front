import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const url = baseUrl + "/api/grn";

const getGRNs = async (page = 1, limit = 20, search = null) => {
  try {
    const response = await axios.get(`${url}?q=${search}&page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in getGRNs:", error?.response?.data);
    return error?.response?.data;
  }
};

const getGRNById = async (grnId) => {
  try {
    const response = await axios.get(`${url}/${grnId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in getGRNById:", error?.response?.data);
    return error?.response?.data;
  }
};

const getGRNByNumber = async (grnNumber) => {
  try {
    console.log("Fetching GRN by number:", grnNumber);
    const response = await axios.get(`${url}/number/${encodeURIComponent(grnNumber)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    console.log("GRN by number response:", data);
    return data;
  } catch (error) {
    console.error("Error in getGRNByNumber:", error?.response?.data);
    return error?.response?.data;
  }
};

const getGRNNumbers = async () => {
  try {
    console.log("Fetching GRN numbers");
    const response = await axios.get(`${url}/numbers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    console.log("GRN numbers response:", data);
    return data;
  } catch (error) {
    console.error("Error in getGRNNumbers:", error?.response?.data);
    return error?.response?.data;
  }
};

const createGRN = async (grnData) => {
  try {
    const response = await axios.post(`${url}`, grnData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in createGRN:", error.response.data);
    return error.response.data;
  }
};

const updateGRN = async (updatedData) => {
  try {
    const response = await axios.put(`${url}/${updatedData._id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in updateGRN:", error.response.data);
    return error.response.data;
  }
};

const deleteGRN = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in deleteGRN:", error.response.data);
    return error.response.data.error;
  }
};  

export { 
  getGRNs, getGRNById, getGRNByNumber, getGRNNumbers, createGRN, updateGRN, deleteGRN 
};