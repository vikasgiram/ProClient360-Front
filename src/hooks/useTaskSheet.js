import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/tasksheet";

const getAllTask = async () => {
  try {
    const response = await axios.get(`${url}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const getTaskSheet = async (id) => {
  try {
    const response = await axios.get(`${url}/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    // console.log("tasksheet data",response);
    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const getMyTaskSheet = async (projectId) => {
  try {
    const response = await axios.get(`${url}/my/${projectId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const createTaskSheet = async (taskData) => {
  try {
    const response = await axios.post(`${url}`, taskData,{
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
    toast.error(error.response.data.error);  }
};

const updateTaskSheet = async (id, updatedData) => {
  try {
    const response = await axios.put(`${url}/${id}`, updatedData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    toast.success("Task Updated Successfuly");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const deleteTaskSheet = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);}
};

export { getAllTask,  createTaskSheet, updateTaskSheet, deleteTaskSheet, getTaskSheet, getMyTaskSheet };
