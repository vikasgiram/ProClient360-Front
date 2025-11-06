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

    // Debug log to check the response
    console.log("Notifications response:", data);

    return data;
    
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data?.error);
    return error?.response?.data;
  }
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
        console.error("Error sending notification:", error);
        toast.error(error.response?.data?.error || "Failed to send notification");
    }
}

const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${url}/${notificationId}`, {}, {
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
        console.error("Error marking notification as read:", error);
        toast.error(error.response?.data?.error || "Failed to mark notification as read");
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
    console.error("Error deleting notification:", error);
    toast.error(error?.response?.data?.error || "Something went wrong.");
  }
};


export { getNotifications, sendNotification, markAsRead, deleteNotification };