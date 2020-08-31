import axios from "axios";
import { BASE_URL } from "../constants";

const getClaimsDynamicsData = async (
  chartId,
  dateFrom,
  dateTo,
  module,
  detail
) => {
  //   return axios.get(`${BASE_URL}/Chart`, {
  //     chartId,
  //     dateFrom,
  //     dateTo,
  //     module,
  //     detail,
  //   });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          ["27 Jul-2 Aug", 5731, 23800, 3901],
          ["3 Aug-9 Aug", 0, 7130, 6489],
          ["10 Aug-16 Aug", 0, 0, 6482],
          ["17 Aug-23 Aug", 0, 2, 4648],
          ["24 Aug-30 Aug", 0, 12, 5664],
        ],
      });
    }, 3000);
  });
};

export default getClaimsDynamicsData;
