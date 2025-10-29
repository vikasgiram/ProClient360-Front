import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const url = baseUrl + "/api/amc";

// Get all AMCs with pagination, search, type filter, and status filter
const getAMCs = async (page = 1, limit = 20, search = null, type = null, status = null) => {
  try {
    let endpoint = `${url}?page=${page}&limit=${limit}`;
    
    if (search) {
      endpoint += `&q=${search}`;
    }
    
    if (type) {
      endpoint += `&type=${type}`;
    }
    
    if (status) {
      endpoint += `&status=${status}`;
    }
    
    console.log("Making API call to:", endpoint);
    
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }); 
    const data = response.data;
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("API error:", error?.response?.data);
    return error?.response?.data;
  }
};

// Get AMC by ID
const getAMCById = async (amcId) => {
  try {
    const response = await axios.get(`${url}/${amcId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error?.response?.data);
    return error?.response?.data;
  }
};

// Create new AMC
const createAMC = async (amcData) => {
  try {
    const response = await axios.post(`${url}`, amcData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error.response.data);
    return error.response.data;
  }
};

// Update AMC - Fixed to match how it's called in the component
const updateAMC = async (id, updatedData) => {
  try {
    const response = await axios.put(`${url}/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error.response.data);
    return error.response.data;
  }
};

// Delete AMC
const deleteAMC = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data.error;
  }
};

// Search AMCs
const searchAMCs = async (searchParams) => {
  try {
    const response = await axios.get(`${url}/search`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: searchParams
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error?.response?.data);
    return error?.response?.data;
  }
};

export { getAMCs, getAMCById, createAMC, updateAMC, deleteAMC, searchAMCs };