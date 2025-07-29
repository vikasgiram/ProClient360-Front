import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/service`;

const useUpdateService = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateService = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseData = response.data;
      
      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      setError(err?.response?.data?.error || 'An error occurred while updating the service');
      setData(null);
      return err?.response?.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateService, data, loading, error };
};

export default useUpdateService;