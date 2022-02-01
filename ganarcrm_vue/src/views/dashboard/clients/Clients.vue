<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-8">
        <h1 class="title">Clients</h1>
      </div>
      <div class="column is-4">
        <div class="buttons">
          <router-link class="button is-info" to="/dashboard/clients/add"
            >Add Client
          </router-link>
          <form @submit.prevent="filterTable">
            <div class="field has-addons">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Client.."
                  v-model="query"
                />
              </div>
              <div class="control">
                <button class="button is-success">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="column is-12">
        <div class="buttons">
          <button
            class="button is-light"
            v-if="showPreviousButton"
            @click="goToPreviousPage()"
          >
            <strong> Previous </strong>
          </button>
          <button
            class="button is-light"
            v-if="showNextButton"
            @click="goToNextPage()"
          >
            <strong>Next</strong>
          </button>
        </div>
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
      showNextButton: false,
      showPreviousButton: false,
      currentPage: 1,
      query: "",
    };
  },

  mounted() {
    this.getClients();
  },

  methods: {
    goToNextPage() {
      this.currentPage += 1;
      this.getClients();
    },

    goToPreviousPage() {
      this.currentPage -= 1;
      this.getClients();
    },
    async getClients() {
      this.$store.commit("setIsLoading", true);

      await axios
        .get(`/api/v1/clients/?page=${this.currentPage}&search=${this.query}`)
        .then((response) => {
          this.clients = response.data.results;

          if (response.data.next) {
            this.showNextButton = true;
          } else {
            this.showNextButton = false;
          }

          if (response.data.previous) {
            this.showPreviousButton = true;
          } else {
            this.showPreviousButton = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
    filterTable() {
      this.getClients();
    },
  },
};
</script>