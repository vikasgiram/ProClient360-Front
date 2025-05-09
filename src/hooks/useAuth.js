import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;

export const loginUser = async (username, password, fcmToken) => {
    try {

    if(username===undefined|| password === undefined){
      return toast.error("Username and password Required");
    }
    const res = await axios.post(`${baseUrl}/api/login`, {
      email: username,
      password: password,
      fcmToken: fcmToken
    });

    if (res.data.success) {
      // Save the token in local storage
      localStorage.setItem('token', res.data.token);
      return res.data.user;
  } else {
      console.error('Error:', res.data.message);
  }

  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.error);
  }
};

export const resetPassword= async (id, token, password, confirmPassword)=>{
  try {
    const res= await axios.post(`${baseUrl}/api/reset-password/${id}/${token}`,{
      password,
      confirmPassword
    });

    if(res.data.error){
      return toast.error(res.data.error);
    }
    toast.success("Password Reseted Sucessfully...");
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.error);
  }
}

export const logout = async ()=>{
  try {
    const res= await axios.get(`${baseUrl}/api/logout`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (res.status === 200) {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('fcmToken');
      console.log('Logout successful:', res.data.message);

  }
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.error);
  }

};

export const changePassword = async (oldPass, newPass, confirmPass) => {
  try {
      // Check if new password and confirm password match
      if (newPass !== confirmPass) {
          return toast.error("New Password and confirm password don't match...");
      }

      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      // Make the API call with the token in the headers
      const res = await axios.post(`${baseUrl}/api/change-password`, 
          { oldPass, newPass }, 
          {
              headers: {
                  Authorization: `Bearer ${token}` // Set the token in the Authorization header
              }
          }
      );

      // Check for errors in the response
      if (res.data.error) {
          console.log(res.data.error);
          return res.data;
      }

      return res.data; // Return the response data if successful
  } catch (error) {
      console.log(error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "An error occurred while changing the password.");
  }
};

export const forgetPassword= async (email)  =>{
  try {
    if(email===''){
      return toast.error("Email is required");
    }
    const res=await axios.post(`${baseUrl}/api/forget-password`,{email});
    if(res.data.error){
      console.log(res.data.error);
      return res.data;
    }
    return res.data;
  } catch (error) {
    console.log(error.response.data.error);
    return error.response.data;
  }
};