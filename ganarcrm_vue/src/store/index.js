import { createStore } from 'vuex'

export default createStore({
  state: { /* The fields are immutable */
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
  mutations: {/* So we use mutations to change the fields*/
    initializeStore(state) {
      /* Checks if there's a token in the local browser, aka checks if logged in*/
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true
        state.user.id = localStorage.getItem('userid')
        state.user.username = localStorage.getItem('username')
        state.team.id = localStorage.getItem('team_id')
        state.team.name = localStorage.getItem('team_name')

      } else {
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
      state.token = token
      state.isAuthenticated = true
    },

    removeToken(state) {
      state.token = ''
      state.isAuthenticated = false
    },

    setUser(state, user) {
      state.user = user
      localStorage.setItem("username", user.username);
      localStorage.setItem("userid", user.id);
    },

    setTeam(state, team) {
      state.team = team
      localStorage.setItem("team_name", team.name);
      localStorage.setItem("team_id", team.id);
    }
  },
  actions: {
  },
  modules: {
  }
})
