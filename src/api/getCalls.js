import axios from "axios";
import { BASE_URL } from "../constants";

const getCalls = async (chartType, dateFrom, dateTo, detail) => {
  return axios.get(`${BASE_URL}/Chart`, {
    params: {
      chartType,
      dateFrom,
      dateTo,
     
      detail,
    },
  });
};


export default getCalls;