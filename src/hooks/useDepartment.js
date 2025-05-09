import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/department";

const getDepartment = async (page, limit) => {
  try {
    const response = await axios.get(`${url}?page=${page}&limit=${limit}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if(response.statusText !== "OK"){
      return toast.error("Something went wrong");
    }
    
    const data = response?.data;

    if (data?.error) {
      console.error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const createDepartment = async (departmentData) => {
  try {
    const response = await axios.post(`${url}`, departmentData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }

    toast.success("Department Created");
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const updateDepartment = async (updatedDepartmentData) => {
  try {
    const response = await axios.put(`${url}/${updatedDepartmentData._id}`, updatedDepartmentData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    toast.success("Department Updated sucessfully...");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.delete(`${url}/${departmentId}`,{
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

  export { getDepartment, deleteDepartment,updateDepartment,createDepartment };