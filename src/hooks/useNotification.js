import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/notification";

const getNotifications = async () => {
  try {
    const response = await axios.get(`${url}/`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = response?.data;
    // console.log("api data",data);
    

    if (data?.error) {
      console.error(data?.error);
      return toast.error(data?.error);
    }
    return data;
    
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.error);  }
};


const sendNotification = async (notificationData) => {
    try {
        const response = await axios.post(`${url}`, notificationData,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = response.data;
        if(data.error){
            console.error(data.error);
            return toast.error(data.error);
        }
        return data;
    
    } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
    }
}

const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${url}/${notificationId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        const data = response.data;
        if(data.error){
          console.error(data.error);
          return toast.error(data.error);
        }
        return data;
      }
      catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
      }
}

//  delete notification

const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${url}/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = response.data;
    if (data.error) {
      console.error(data.error);
      return toast.error(data.error);
    }
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.error || "Something went wrong.");
  }
};


export { getNotifications, sendNotification, markAsRead, deleteNotification};
