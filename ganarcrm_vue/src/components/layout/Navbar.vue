<template>
  <nav class="navbar is-dark">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <strong>Ganar CRM</strong>
      </router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="!$store.state.isAuthenticated">
              <router-link to="/sign-up" class="button is-success">
                <strong>Sign up</strong>
              </router-link>
              <router-link to="/log-in" class="button is-ligh">
                <strong>Log in</strong>
              </router-link>
            </template>
            <template v-else>
              <router-link to="/dashboard/leads" class="button is-info">
                <strong>Leads</strong>
              </router-link>
              <router-link to="/dashboard/clients" class="button is-info">
                <strong>Clients</strong>
              </router-link>
              <router-link to="/dashboard/team" class="button is-info">
                <strong>Team</strong>
              </router-link>
              <router-link to="/dashboard/my-account" class="button is-info">
                <strong>My Account</strong>
              </router-link>
              <button @click="logout()" class="button is-danger">
                Log Out
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
export default {
  name: "Navbar",
  methods: {
    async logout() {
      await axios
        .post("/api/v1/token/logout/")
        .then((response) => {
          console.log("Logged out");
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });

      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userid");
      localStorage.removeItem("team_name");
      localStorage.removeItem("team_id");
      this.$store.commit("removeToken");

      this.$router.push("/");
    },
  },
};
</script>