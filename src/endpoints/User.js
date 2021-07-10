import http from "@/helpers/Http.js";

class User {
    getAll = () => http.get('api/users');

    getById = (id) => http.get(`api/users/${id}`)

    store = (data) => http.post('api/users/',data)

    update = (id,data) => http.put(`api/users/${id}`,data)

    delete = (id) => http.delete(`api/users/${id}`)
}

export default new User;
