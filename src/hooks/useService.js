import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/service";

const getAllService = async (page, limit) => {
  try {
    const response = await axios.get(`${url}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    // console.log("api actions",response);
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);  }
};


const getMyService = async () => {
  try {
    const response = await axios.get(`${url}/myService`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    // console.log("api actions",response);
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);  }
};


const createService = async (serviceData) => {
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
    toast.success("Service Assigned..");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const updateService = async (id, updatedData) => {
//   console.log(id,updatedData);
  
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
    toast.success("Service Updated Successfuly");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};


const deleteService = async (Id) => {
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

export { getAllService, createService, updateService, deleteService ,getMyService};
