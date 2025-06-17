import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/leads`;

const useUpdateLead = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLead = async (id, updatedData) => {
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

      setData(responseData);
      setError(null);
      toast.success('Lead Updated successfully');
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

  return { updateLead, data, loading, error };
};

export default useUpdateLead;