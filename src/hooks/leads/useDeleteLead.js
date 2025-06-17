import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/leads`;

const useDeleteLead = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLead = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/${id}`, {
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
      toast.success('Lead Deleted successfully');
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete Lead';
      setError(errorMessage);
      setData(null);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLead, data, loading, error };
};

export default useDeleteLead;