import http from "@/helpers/Http.js";

class User {
    getAll = (params) => http.get('api/v1/admin/users',{ params: params });

    getById = (id) => http.get(`api/v1/admin/users/${id}/edit`)

    getUserGroups = () => http.get('api/v1/admin/users/create')

    store = (data) => http.post('api/v1/admin/users/',data)

    update = (id,data) => http.put(`api/v1/admin/users/${id}`,data)

    delete = (id) => http.delete(`api/v1/admin/users/${id}`)
    
}

export default new User;
