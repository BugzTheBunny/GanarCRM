<template>
  <div class="container">
    <div class="colums is-multiline">
      <div class="column is-12">
        <h1 class="title">Add team</h1>
      </div>

      <div class="column is-6 is-offset-right-4">
        <form @submit.prevent="submitForm">
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="name"
                placeholder="Team Name"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-success">Add Team</button>
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
  name: "AddTeam",
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async submitForm() {
      this.$store.commit("setIsLoading", true);

      const team = {
        name: this.name,
      };
      await axios
        .post("/api/v1/teams/", team)
        .then((response) => {
          toast({
            message: `${this.name} team was added`,
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
            duration: 2000,
            position: "bottom-right",
          });

          this.$store.commit("setTeam", {
            id: response.data.id,
            name: this.name,
          });

          this.$router.push("/dashboard");
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>