<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">Edit {{ client.name }}</h1>
      </div>

      <div class="column is-12">
        <form @submit.prevent="submitForm">
          <div class="field">
            <label>Name</label>
            <div class="control">
              <input type="text" class="input" v-model="client.name" />
            </div>
          </div>
          <div class="field">
            <label>Contact Person</label>
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="client.contact_person"
              />
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <div class="control">
              <input type="email" class="input" v-model="client.email" />
            </div>
          </div>
          <div class="field">
            <label>Phone</label>
            <div class="control">
              <input type="text" class="input" v-model="client.phone" />
            </div>
          </div>
          <div class="field">
            <label>Website</label>
            <div class="control">
              <input type="text" class="input" v-model="client.website" />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-success is-fullwidth">Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "bulma-toast";

export default {
  name: "EditClient",
  data() {
    return {
      client: {},
    };
  },
  mounted() {
    this.getClient();
  },
  methods: {
    async getClient() {
      this.$store.commit("setIsLoading", true);

      const clientID = this.$route.params.id;

      axios
        .get(`api/v1/clients/${clientID}`)
        .then((response) => {
          this.client = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },

    async submitForm() {
      const clientID = this.$route.params.id;
      this.$store.commit("setIsLoading", true);
      axios
        .patch(`/api/v1/clients/${clientID}/`, this.client)
        .then((response) => {
          toast({
            message: "Client was updated!",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
            duration: 2000,
            position: "bottom-right",
          });
          this.$router.push(`/dashboard/clients/${clientID}`);
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
    // async getTeam() {
    //   this.$store.commit("setIsLoading", true);

    //   await axios
    //     .get("/api/v1/teams/get_my_team/")
    //     .then((response) => {
    //       this.team = response.data;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    //   this.$store.commit("setIsLoading", false);
    // },
  },
};
</script>