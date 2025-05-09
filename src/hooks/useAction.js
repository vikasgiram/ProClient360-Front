import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/action";

const getAllActions = async (taskId) => {
  try {
    const response = await axios.get(`${url}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    // console.log("api actions",data);
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);  }
};


const createAction = async (actionData) => {
  try {
    // console.log("new action data",actionData);
    const response = await axios.post(`${url}`, actionData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    toast.success("Action submitted..");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const updateAction = async (id, updatedData) => {
  try {
    // console.log(updatedData);
    const response = await axios.put(`${url}/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    toast.success("Action Updated Successfuly");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const deleteAction = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`, {
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

export { getAllActions, createAction, updateAction, deleteAction };
