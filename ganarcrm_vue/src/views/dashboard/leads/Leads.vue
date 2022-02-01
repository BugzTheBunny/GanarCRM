<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-8">
        <h1 class="title">Leads</h1>
      </div>
      <div class="column is-2">
        <router-link class="button is-info" to="/dashboard/leads/add"
          >Add Lead
        </router-link>
      </div>
      <div class="column is-12">
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
  name: "Lead",
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

      await axios
        .get("/api/v1/leads/")
        .then((response) => {
          this.leads = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>