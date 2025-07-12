import axios from 'axios';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/serviceAction";

const getAllServiceActions = async (serviceId) => {
  try {
    const response = await axios.get(`${url}/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    // console.log("api actions",data);
    return data;
  } catch (error) {
    console.error(error.response?.data);
    return error?.response?.data;
  }
};



const createServiceAction = async (serviceData) => {
  try {
    // console.log("new action data",actionData);
    const response = await axios.post(`${url}`, serviceData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error.response?.data);
    return error?.response?.data;
  }
};

const updateServiceAction = async (id, updatedData) => {
  try {
    // console.log(updatedData);
    const response = await axios.put(`${url}/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error.response?.data);
    return error?.response?.data;
  }
};

const deleteServiceAction = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    return data;
  } catch (error) {
    console.error(error.response?.data);
    return error?.response?.data;
  }
};

export { getAllServiceActions, createServiceAction, updateServiceAction, deleteServiceAction };
