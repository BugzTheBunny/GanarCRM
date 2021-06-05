import { createStore } from 'vuex'

export default createStore({
  state: {
    /*These variables will be used across the application*/
    isLoading: false,
    isAuthenticated: false,
    token: '',
    user: {
      id: 0,
      username: ''
    },
    team: {
      id: 0,
      name: ''
    }
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
        state.user.username = localStorage.getItem('username')
        state.user.id = localStorage.getItem('userid')
        state.team.id = localStorage.getItem('team_id')
        state.team.name = localStorage.getItem('team_name')


      } else {
        /* If we don't have a token inside the storage
        we will not be authenticated */
        state.token = ''
        state.isAuthenticated = false
        state.user.id = 0
        state.user.username = ''
        state.team.id = 0
        state.team.name = ''

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
      /* This function will clear the token, and remove the authenticatiidon */
      state.token = ''
      state.isAuthenticated = false
    },
    setUser(state, user) {
      state.user = user
    },
    setTeam(state, team) {
      state.team = team

      localStorage.setItem('team_id', team.id)
      localStorage.setItem('team_name', team.name)

    }
  },
  actions: {
  },
  modules: {
  }
})
