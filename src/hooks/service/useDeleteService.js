import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl = process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/service`;

const useDeleteService = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteService = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseData = response.data;
      

      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete service');
      setData(null);
      return err.response?.data;
    } finally {
      setLoading(false);
    }
  };

  return { deleteService, data, loading, error };
};

export default useDeleteService;