<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-8">
        <h1 class="title">Clients</h1>
      </div>
      <div class="column is-2">
        <router-link class="button is-info" to="/dashboard/clients/add"
          >Add Client
        </router-link>
      </div>
      <div class="column is-12">
        <template v-if="clients.length">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact person</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" v-bind:key="client.id">
                <td>{{ client.name }}</td>
                <td>{{ client.contact_person }}</td>
                <td>
                  <div class="buttons">
                    <router-link
                      :to="{ name: 'Client', params: { id: client.id } }"
                      class="button is-success"
                      >View</router-link
                    >
                    <router-link
                      :to="{ name: 'EditClient', params: { id: client.id } }"
                      class="button is-success"
                      >Edit</router-link
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <h1>You don't have any clients yet.</h1>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "Clients",
  data() {
    return {
      clients: [],
    };
  },

  mounted() {
    this.getClients();
  },

  methods: {
    async getClients() {
      this.$store.commit("setIsLoading", true);

      await axios
        .get("/api/v1/clients/")
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>