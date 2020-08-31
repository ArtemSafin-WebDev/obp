import axios from "axios";
import { BASE_URL } from "../constants";

const getClaimsDynamicsByTypeData = async (
  chartId,
  dateFrom,
  dateTo,
  module,
  detail,
  status
) => {
  //   return axios.get(`${BASE_URL}/Chart`, {
  //     chartId,
  //     dateFrom,
  //     dateTo,
  //     module,
  //     detail,
  //     status
  //   });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          ["27 Jul-2 Aug", 2598, 389],
          ["3 Aug-9 Aug", 0, 0],
          ["10 Aug-16 Aug", 0, 0],
          ["17 Aug-23 Aug", 0, 0],
          ["24 Aug-30 Aug", 0, 0],
        ],
      });
    }, 3000);
  });
};

export default getClaimsDynamicsByTypeData;
