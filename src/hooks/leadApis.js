import axios from 'axios';
import toast from 'react-hot-toast';

const baseUrl= process.env.REACT_APP_API_URL;
const url=baseUrl+"/api/company/lead-config";

const sendTradeIndiaApiKey = async (tradeIndiaConfig) => {
    try {
        const response = await axios.put(url, tradeIndiaConfig, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }});
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to send TradeIndia API key');
    }
}

const getTradeIndiaApiKey = async () => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to fetch TradeIndia API key');
    }
}

export { sendTradeIndiaApiKey, getTradeIndiaApiKey };