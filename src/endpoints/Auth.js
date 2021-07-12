import http from "@/helpers/Http.js";

class Auth {
    login = (data) => http.post('api/v1/admin/login', data);

    groupAccess = (id) => http.get('api/v1/admin/user-group-access/' + id)
}

export default new Auth;
