import http from "../routes/Http.js";

class Login {
    create = (data) => http.post('api/login', data);
}

export default new Login;