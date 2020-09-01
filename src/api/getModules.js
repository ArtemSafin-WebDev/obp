import axios from "axios";
import { BASE_URL } from "../constants";


const getModules = async () => {
    return axios.get(`${BASE_URL}/Chart/modules`);
}


export default getModules;