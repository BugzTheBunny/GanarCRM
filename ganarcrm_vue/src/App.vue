<template>
  <div>
    <Navbar />
    <section class="section">
      <router-view />
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/layout/Navbar";
import axios from "axios"; /* add axios */

export default {
  name: "App",
  components: {
    Navbar,
  },
  beforeCreate() {
    /* This function will be called on-create of the app */
    this.$store.commit("initStore"); /* calling the store initialization */

    if (this.$store.state.token) {
      /* If there is a token in the store state, we will set a token for axios */
      axios.defaults.headers.common["Authorization"] =
        "Token " + this.$store.state.token;
    } else {
      /* If there's no token is the store, we will not get authorization */
      axios.defaults.headers.common["Authorization"] = "";
    }
  },
};
</script>

<style lang="scss">
@import "../node_modules/bulma";
</style>
