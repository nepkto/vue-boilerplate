import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
export default axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
    headers: {
        "Content-type": "application/json",
    }
});