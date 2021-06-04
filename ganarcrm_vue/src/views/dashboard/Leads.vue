<template>
  <div class="container">
    <div class="colums is-multiline">
      <div class="column is-12">
        <h1 class="title">
          Leads
          <router-link to="/dashboard/leads/add" class="button is-light">
            + Add lead</router-link
          >
        </h1>
      </div>

      <div class="column is-12">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" v-bind:key="lead.id">
              <td>
                <router-link :to="{ name: 'Lead', params: { id: lead.id } }"
                  ><strong>{{ lead.company }}</strong></router-link
                >
              </td>
              <td>{{ lead.contact_person }}</td>
              <td>{{ lead.status }}</td>
              <td>
                <router-link
                  :to="{ name: 'EditLead', params: { id: lead.id } }"
                  class="button is-light"
                  ><strong>Edit</strong></router-link
                >
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
    };
  },
  mounted() {
    this.getLeads();
  },
  methods: {
    async getLeads() {
      this.$store.commit("setIsLoading", true);

      axios
        .get("/api/v1/leads/")
        .then((response) => {
          this.leads = response.data;
        })
        .catch((error) => {
          conlose.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>