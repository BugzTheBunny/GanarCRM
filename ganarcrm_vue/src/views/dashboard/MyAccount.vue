<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">
          <strong>My Account</strong>
        </h1>
      </div>
      <div class="column is-12">
        <div class="buttons">
          <router-link
            class="button is-primary"
            :to="{ name: 'EditUser', params: { id: $store.state.user.id } }"
            >Edit</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyAccount",
};
</script>