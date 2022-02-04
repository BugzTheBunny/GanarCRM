<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-8">
        <h1 class="title">Leads</h1>
        <div
          class="notification is-danger"
          v-if="$store.state.team.max_leads == total_leads"
        >
          Max capacity of plan reached, Please upgrade!
        </div>
      </div>
      <div class="column is-4">
        <div class="buttons">
          <router-link
            v-if="$store.state.team.max_leads > total_leads"
            class="button is-info"
            to="/dashboard/leads/add"
            >Add Lead
          </router-link>
          <form @submit.prevent="filterTable">
            <div class="field has-addons">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Lead.."
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
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact person</th>
              <th>Assigned to</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" v-bind:key="lead.id">
              <td>{{ lead.company }}</td>
              <td>{{ lead.contact_person }}</td>
              <template v-if="lead.assigned_to">
                <td>
                  {{ lead.assigned_to.first_name }}
                  {{ lead.assigned_to.last_name }}
                </td>
              </template>
              <template v-else>
                <td></td>
              </template>
              <td>{{ lead.status }}</td>
              <td>
                <div class="buttons">
                  <router-link
                    :to="{ name: 'Lead', params: { id: lead.id } }"
                    class="button is-success"
                    >View</router-link
                  >
                  <router-link
                    :to="{ name: 'EditLead', params: { id: lead.id } }"
                    class="button is-success"
                    >Edit</router-link
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Leads",
  data() {
    return {
      leads: [],
      total_leads: 0,
      showNextButton: false,
      showPreviousButton: false,
      currentPage: 1,
      query: "",
    };
  },
  mounted() {
    this.getLeads();
  },
  methods: {
    goToNextPage() {
      this.currentPage += 1;
      this.getLeads();
    },

    goToPreviousPage() {
      this.currentPage -= 1;
      this.getLeads();
    },
    async getLeads() {
      this.$store.commit("setIsLoading", true);

      /* Table data*/
      await axios
        .get(`/api/v1/leads/?page=${this.currentPage}&search=${this.query}`)
        .then((response) => {
          this.leads = response.data.results;
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

      /* Full Data */
      await axios
        .get(`/api/v1/leads/`)
        .then((response) => {
          this.total_leads = response.data.count;
          console.log(this.total_leads);
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
    filterTable() {
      this.getLeads();
    },
  },
};
</script>