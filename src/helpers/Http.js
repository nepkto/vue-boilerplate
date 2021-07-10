import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
const AUTH_TOKEN = localStorage.getItem('token')

const instance = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
    headers: {
        "Content-type": "application/json",
    }
});

if(AUTH_TOKEN) {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN;
}
export default instance;