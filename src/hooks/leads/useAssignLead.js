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

      return responseData;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update Lead');
      setData(null);
      return err.response?.data;
    } finally {
      setLoading(false);
    }
  };

  return { assignLead, data, loading, error };
};

export default useAssignLead;