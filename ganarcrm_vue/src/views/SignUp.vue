<template>
  <div class="container">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Sign Up</h1>

        <form>
          <!-- Email field -->
          <div class="field">
            <label>Email</label>
            <div class="control">
              <input type="text" name="email" class="input" />
            </div>
          </div>

          <!-- Password field -->
          <div class="field">
            <label>Password</label>
            <div class="control">
              <input type="password" name="password1" class="input" />
            </div>
          </div>

          <!-- Confirm password field -->
          <div class="field">
            <label>Confirm Password</label>
            <div class="control">
              <input type="text" name="password2" class="input" />
            </div>
          </div>

          <!-- Submit form -->
          <div class="field">
            <div class="control">
              <button class="button is-success">Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUp",
};
</script>