import axios from 'axios';
import  toast  from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
const url = baseUrl + "/api/department";

const getDepartment = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${url}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
  
    if (response.status !== 200) {
      toast.error("Failed to fetch departments");
      return { success: false, error: "Failed to fetch departments" };
    }
    
    const data = response.data;
    
    
    if (!data) {
      console.error("Empty response from server");
      return { success: false, error: "Empty response from server" };
    }
    
  
    return { 
      success: true, 
      departments: data.departments || [], 
      pagination: data.pagination || {
        currentPage: page,
        totalPages: 0,
        totalDepartments: 0,
        limit: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
    
  } catch (error) {
    console.error("Error fetching departments:", error);
    const errorMessage = error.response?.data?.error || "Failed to connect to server";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

const createDepartment = async (departmentData) => {
  try {
    const response = await axios.post(url, departmentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = response.data;
    
    return data;
    
  } catch (error) {
    console.error("Error creating department:", error.response?.data);
    return error.response.data;
  }
};

const updateDepartment = async (updatedDepartmentData) => {
  try {
    if (!updatedDepartmentData._id) {
      toast.error("Department ID is required for update");
      return { success: false, error: "Department ID is required" };
    }
    
    const response = await axios.put(`${url}/${updatedDepartmentData._id}`, updatedDepartmentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = response.data;
    
    return data;
    
  } catch (error) {
    console.error("Error updating department:", error.response?.data);
    return error.response.data;
  }
};

const deleteDepartment = async (departmentId) => {
  try {
    if (!departmentId) {
      toast.error("Department ID is required for deletion");
      return { success: false, error: "Department ID is required" };
    }
    
    const response = await axios.delete(`${url}/${departmentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = response.data;
    
    if (response.status !== 200) {
      const errorMessage = data.error || "Failed to delete department";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    return { success: true, message: "Department deleted successfully" };
    
  } catch (error) {
    console.error("Error deleting department:", error);
    const errorMessage = error.response?.data?.error || "Failed to delete department";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export { getDepartment, createDepartment, updateDepartment, deleteDepartment };