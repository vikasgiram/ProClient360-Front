import axios from "axios";

const url= 'https://api.postalpincode.in/pincode/'

const getAddress = async (pincode) => {
    try {
      const response = await axios.get(`${url}/${pincode}`)

      if(response.data[0].Status === 'Success'){
        const apiData = response.data[0].PostOffice[0];
        const data= {
          state: apiData.State,
          city: apiData.District,
          country: apiData.Country,
          pincode: apiData.Pincode
        }
        return data;
      }
      return response.data[0].Status;
    } catch (error) {
      console.error(error);
    }
  };


export { getAddress };
  