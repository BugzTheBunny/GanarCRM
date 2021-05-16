import { createStore } from 'vuex'

export default createStore({
  state: {
    /*These variables will be used across the application*/
    isLoading: false,
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    initStore(state) {
      /* This funtion will be called in the initialization of App.vue
      meaning when we load the app, this will run, and do what it needs.
      for example the code below will validate the login by checking
      the token in the local storage */
      if (localStorage.getItem('token')) {
        /* Checks if we have a token inside the local storage already
        if we have a token already, the isAuthenticated status will be set to true
        and the token will be added */
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true
      } else {
        /* If we don't have a token inside the storage
        we will not be authenticated */
        state.token = ''
        state.isAuthenticated = false
      }
    },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setToken(state, token) {
      /* This function will set the token and make us authenticated */
      state.token = token
      state.isAuthenticated = true
    },
    removeToken(state) {
      /* This function will clear the token, and remove the authentication */
      state.token = ''
      state.isAuthenticated = false
    }
  },
  actions: {
  },
  modules: {
  }
})
