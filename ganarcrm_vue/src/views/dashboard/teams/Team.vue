<template>
  <div class="container">
    <div class="columns">
      <div class="column is-12 is-multiline">
        <h1 class="title">
          <strong>{{ team.name }}</strong>
        </h1>
        <template v-if="team.created_by.id === parseInt($store.state.user.id)">
          <router-link :to="{ name: 'AddMember' }" class="button is-primary"
            >Add Member</router-link
          >
        </template>

        <div class="column is-12">
          <h2 class="subtitle">Members</h2>

          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in team.members" v-bind:key="member.id">
                <td>{{ member.username }}</td>
                <td>{{ member.first_name }} {{ member.last_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Team",
  data() {
    return {
      team: {
        members: [],
        created_by: {},
      },
    };
  },
  mounted() {
    this.getTeam();
  },
  methods: {
    async getTeam() {
      this.$store.commit("setIsLoading", true);

      await axios
        .get("/api/v1/teams/get_my_team/")
        .then((response) => {
          this.team = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>