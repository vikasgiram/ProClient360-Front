import axios from 'axios';
import toast from 'react-hot-toast';

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
    console.error(error);
    toast.error(error?.response?.data?.message);  }
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

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    toast.success("Work submitted..");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.error);  }
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

    if (data.error) {
      console.error(data.error);
      return alert(data.error);
    }
    toast.success("Service Action Updated Successfuly");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.error);  }
};

const deleteServiceAction = async (Id) => {
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
    toast.error(error?.response?.data?.error);}
};

export { getAllServiceActions, createServiceAction, updateServiceAction, deleteServiceAction };
