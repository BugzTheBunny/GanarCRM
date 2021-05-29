<template>
  <div class="container">
    <div class="colums is-multiline">
      <div class="column is-12">
        <h1 class="title">Add lead</h1>
      </div>

      <div class="column is-6 is-offset-right-4">
        <form @submit.prevent="submitForm">
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="company"
                placeholder="Company"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="contact_person"
                placeholder="Contact person"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="phone"
                placeholder="Phone"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="text"
                class="input"
                v-model="website"
                placeholder="Website"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="number"
                class="input"
                v-model="confidance"
                placeholder="Confidance"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                type="number"
                class="input"
                v-model="estimated_value"
                placeholder="Estimated Value"
              />
            </div>
          </div>
          <div class="field">
            <label>Status</label>
            <div class="control">
              <div class="select">
                <select class="select" v-model="status">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="inprogress">In progress</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Priority</label>
            <div class="control">
              <div class="select">
                <select v-model="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-success">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddLead",
  data() {
    return {
      company: "",
      contact_person: "",
      email: "",
      phone: "",
      website: "",
      confidance: 0,
      estimated_value: 0,
      status: "new",
      priority: "medium",
    };
  },
  methods: {
    async submitForm() {
      this.$store.commit("setIsLoading", true);
      const lead = {
        company: this.company,
        contact_person: this.contact_person,
        email: this.email,
        phone: this.phone,
        website: this.website,
        estimated_value: this.estimated_value,
        confidance: this.confidance,
        status: this.status,
        priority: this.priority,
      };
      await axios
        .post("/api/v1/leads/", lead)
        .then((respose) => {
          console.log(respose);

          this.$router.push("/dashboard/leads");
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>