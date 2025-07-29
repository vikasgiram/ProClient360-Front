import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/task";

const getTask = async (page = 1, limit = 20, search = "") => {
  try {
    let queryParams = `?page=${page}&limit=${limit}`;
    if (search) {
      queryParams += `&q=${encodeURIComponent(search)}`;
    }
    
    const response = await axios.get(`${url}${queryParams}`,{
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
    console.error( error?.response?.data);
    return error?.response?.data;
  }
};

const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${url}`, taskData,{
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

const updateTask = async (Id, updatedData) => {
  try {
    const response = await axios.put(`${url}/${Id}`, updatedData,{
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

const deleteTask = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export { getTask,  createTask, updateTask, deleteTask };
