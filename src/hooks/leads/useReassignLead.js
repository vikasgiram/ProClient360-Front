import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/leads/reassign`;

const useReassignLead = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reassignLead = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        setData(responseData);
        return responseData;
      } else {
        setError(responseData.error || 'Failed to reassign lead');
        return responseData;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to reassign lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { reassignLead, data, loading, error };
};

export default useReassignLead;