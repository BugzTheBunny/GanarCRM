import { createStore } from 'vuex'

export default createStore({
  state: { /* The fields are immutable */
    isLoading: false,
    isAuthenticated: false,
    token: ''
  },
  mutations: {/* So we use mutations to change the fields*/
    initializeStore(state){
      /* Checks if there's a token in the local browser, aka checks if logged in*/
      if (localStorage.getItem('token')){
        state.token=localStorage.getItem('token')
        state.isAuthenticated = true
      } else{
        state.token = ''
        state.isAuthenticated = false
      }
    },
    
    setIsLoading(state,status){
      state.isLoading = status
    },

    setToken(state,token){
      state.token = token
      state.isAuthenticated = true
    },

    removeToken(state){
      state.token = ''
      state.isAuthenticated = false
    }
  },
  actions: {
  },
  modules: {
  }
})
