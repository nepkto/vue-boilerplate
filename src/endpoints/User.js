import http from "@/helpers/Http.js";

class User {
    getAll = () => http.get('api/v1/admin/users');

    getById = (id) => http.get(`api/v1/admin/users/${id}`)

    store = (data) => http.post('api/v1/admin/users/',data)

    update = (id,data) => http.put(`api/v1/admin/users/${id}`,data)

    delete = (id) => http.delete(`api/v1/admin/users/${id}`)
}

export default new User;
