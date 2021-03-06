import Auth from '@/endpoints/Auth'
import http from "@/helpers/Http.js";

export const auth = {
    namespaced: true,

    state: {
      status: '',
      btnStatus: 'Log In',
      token: localStorage.getItem('token') || '',
      user : JSON.parse(localStorage.getItem('user')) || {},
      permissions:JSON.parse(localStorage.getItem('permissions')) || []
    },
    mutations: {
      auth_request(state){
        state.status = 'loading'
        state.btnStatus = 'Sending...'
      },
      auth_success(state, {token, permissions, user}){

        state.status = 'success'
        state.btnStatus = 'Success'
        state.token = token
        state.user = user
        state.permissions = permissions
      },
      auth_error(state){
        state.status = 'error'
        state.btnStatus= 'Log In'
      },
      logout(state){
        state.status = ''
        state.token = ''
        state.user = {}
        state.permissions = []
      },
    },
    actions: {
      async login({commit},data) {
       commit('auth_request')
       return await Auth.login(data)
      },

      async logout({commit}) {
        commit('logout')
        // localStorage.removeItem('token')
        localStorage.clear();
        delete http.defaults.headers.common['Authorization']
      },
      async group_acess({commit},userId) {
        console.log(commit);
        return await Auth.groupAccess(userId)
      }
    },
    getters : {
      isLoggedIn: state => !!state.token,
      authStatus: state => state.status,
    }
}
   
  