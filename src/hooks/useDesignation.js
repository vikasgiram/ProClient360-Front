import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/designation";

const getDesignation = async (department) => {
  try {
    const response = await axios.get(`${url}?department=${department}`,{
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

const getAllDesignations = async (page, limit, department) => {
  try {
    const response = await axios.get(`${url}/allDesignations`,{
      params: {
        page, limit, department
      },
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

const createDesignation = async (designationData) => {
  try {
    const response = await axios.post(`${url}`, designationData,{
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

const updateDesignation = async (updatedDesignationData) => {
  try {
    const response = await axios.put(`${url}/${updatedDesignationData._id}`, updatedDesignationData,{
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

const deleteDesignation = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;
    
    return data;
  } catch (error) {
    console.log("error is :",error.response.data.error);
    return error.response.data; 
   }
};

  export { getDesignation, createDesignation,deleteDesignation, updateDesignation , getAllDesignations};