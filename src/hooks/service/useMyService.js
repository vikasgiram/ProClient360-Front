import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
let url = `${baseUrl}/api/service/myService`;

const useMyServices = (page = 1, limit = 20, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyServices = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          ...(filters.serviceType && { serviceType: filters.serviceType }),
          ...(filters.status && { status: filters.status }),
          ...(filters.priority && { priority: filters.priority }),
        };

        const response = await axios.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setData(response.data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch my services';
        setError(errorMessage);
        setData(null);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, [page, limit, filters.serviceType, filters.status, filters.priority]);

  return { data, loading, error };
};

export default useMyServices;