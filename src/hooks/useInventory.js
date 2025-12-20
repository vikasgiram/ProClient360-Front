import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const url = baseUrl + "/api/inventory";

const getInventory = async (page = 1, limit = 20, search = null, category = null, stockStatus = null) => {
  try {
    let endpoint = `${url}?page=${page}&limit=${limit}`;
    
    if (search) {
      endpoint += `&q=${search}`;
    }
    
    if (category) {
      endpoint += `&category=${category}`;
    }
    
    if (stockStatus) {
      endpoint += `&stockStatus=${stockStatus}`;
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

// Get inventory item by ID
const getInventoryById = async (inventoryId) => {
  try {
    const response = await axios.get(`${url}/${inventoryId}`, {
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

// Create new inventory item
const createInventory = async (inventoryData) => {
  try {
    const response = await axios.post(`${url}`, inventoryData, {
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

// Update inventory item
const updateInventory = async (id, updatedData) => {
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

// Delete inventory item
const deleteInventory = async (id) => {
  try {
    const response = await axios.delete(`${url}/${id}`, {
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

// Search inventory items
const searchInventory = async (searchParams) => {
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

// Get low stock items
const getLowStockItems = async () => {
  try {
    const response = await axios.get(`${url}/low-stock`, {
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

// Get inventory by category
const getInventoryByCategory = async (category) => {
  try {
    const response = await axios.get(`${url}/category/${category}`, {
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

// Add stock transaction (incoming/outgoing)
const addStockTransaction = async (id, transactionData) => {
  try {
    const response = await axios.post(`${url}/${id}/transaction`, transactionData, {
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

// Get transaction history for an item
const getTransactionHistory = async (id) => {
  try {
    const response = await axios.get(`${url}/${id}/transactions`, {
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

export { 
  getInventory, 
  getInventoryById, 
  createInventory, 
  updateInventory, 
  deleteInventory, 
  searchInventory,
  getLowStockItems,
  getInventoryByCategory,
  addStockTransaction,
  getTransactionHistory
};