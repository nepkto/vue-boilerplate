import http from "@/helpers/Http.js";

class Auth {
    login = (data) => http.post('api/login', data);
}

export default new Auth;
