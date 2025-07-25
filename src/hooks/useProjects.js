import axios from "axios";
import toast from "react-hot-toast";

const baseUrl= process.env.REACT_APP_API_URL;
const url =baseUrl+"/api/project";

const getProjects = async (page, limit, filters={}) => {
  try {
    const params = {
      page: page,
      limit: limit,
      ...(filters.status && { status: filters.status }),
    };
    const response = await axios.get(url,{
      params: params,
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
    toast.error(error.response.data.error);
  }
};

const getMyProjects = async () => {
  try {
    const response = await axios.get(`${url}/my`,{
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
    toast.error(error.response.data.error);
  }
};

const createProject = async (projectData) => {
  try {
    // console.log("project Data in api", projectData);
    const response = await axios.post(`${url}`, projectData,{
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

const exportProject = async (startDate, endDate, status) => {
  try {
    const response = await axios.get(`${url}/export-pdf`, {
      params: {
        startDate,
        endDate,
        status
      },
      responseType: "blob",
    },{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const URL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = URL;
    link.setAttribute("download", "projects_report.pdf");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || "Error exporting projects");
  }
};

const updateProject = async (updatedProjectData) => {
  try {
    const response = await axios.put(
      `${url}/${updatedProjectData._id}`,
      updatedProjectData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

const deleteProject = async (Id) => {
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

const getProject = async (Id) => {
  try {
    const response = await axios.get(`${url}/${Id}`,{
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
    toast.error(error.response.data.error);
  }
};

export {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getMyProjects,
  exportProject
};
