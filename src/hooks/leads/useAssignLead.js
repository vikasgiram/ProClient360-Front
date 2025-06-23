import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/leads/assign`;

const useAssignLead = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assignLead = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseData = response.data;
      if (responseData.error) {
        setError(responseData.error);
        setData(null);
        toast.error(responseData.error);
        return null;
      }
      if(responseData.success){
        toast.success(responseData.message || 'Lead assigned successfully');
      }

      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update Lead';
      setError(errorMessage);
      setData(null);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { assignLead, data, loading, error };
};

export default useAssignLead;