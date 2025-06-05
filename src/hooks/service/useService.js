import { useState, useEffect } from 'react';
import axios from 'axios';
const baseUrl= process.env.REACT_APP_API_URL;
const url = baseUrl+"/api/service";

const useServices = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
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
        setError(err.response?.data?.error || 'Failed to fetch services');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, limit, filters.serviceType, filters.status, filters.priority]);

  return { data, loading, error };
};

export default useServices;