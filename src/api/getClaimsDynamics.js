import axios from "axios";
import { BASE_URL } from "../constants";

const getClaimsDynamicsData = async (
  chartType,
  dateFrom,
  dateTo,
  module,
  detail
) => {
  return axios.get(`${BASE_URL}/Chart`, {
    params: {
      chartType,
      dateFrom,
      dateTo,
      module,
      detail,
    },
  });


  
  
};

export default getClaimsDynamicsData;
