import Auth from '@/endpoints/Auth'
export const auth = {
    namespaced: true,

    state: {
      status: '',
      btnStatus: 'Log In',
      token: localStorage.getItem('token') || '',
      user : {},
      permissions:{}
    },
    mutations: {
      auth_request(state){
        state.status = 'loading'
        state.btnStatus = 'Sending...'
      },
      auth_success(state, token, permissions, user){
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
      },
    },
    actions: {
      async login({commit},data) {
       commit('auth_request')
       return await Auth.login(data)
      },

      async logout({commit}) {
        commit('logout')
        localStorage.removeItem('token')
        // delete axios.defaults.headers.common['Authorization']
      }
    },
    getters : {
      isLoggedIn: state => !!state.token,
      authStatus: state => state.status,
    }
}
   
  