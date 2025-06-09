import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/company";


const getDashboardData = async () => {
  try {
    const response = await axios.get(`${url}/dashboard`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const getCompany = async (page, limit=10, search=null) => {
  try {
    const response = await axios.get(`${url}?q=${search}&page=${page}&limit=${limit}`,{
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

const createCompany = async (companyData) => {
  try {
    const response = await axios.post(`${url}`, companyData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    toast.success("New Company Created...");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};


const updateCompany = async (updatedData) => {
 

  try {
   
    const response = await axios.put(`${url}/${updatedData._id}`, updatedData, {
      
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("data",response);
    const data = response.data;
   
    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    toast.success("Company Updated successfully");
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);  }
};

const deleteCompany = async (Id) => {
  try {
    const response = await axios.delete(`${url}/${Id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response.data;

    if (data.error) {
      return toast.error(data.error);
    }

    toast.success("Company Deleted sucessfully...");
  } catch (error) {
    console.log(error.response.data);
    toast.error(error.response.data.error);  }
};

export { getDashboardData, createCompany, updateCompany, deleteCompany,getCompany };

