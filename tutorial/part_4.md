### **Part 4** - Editing leads

1. **Adding a link to the leads in the navbar.**
    - open `Navbar.vue`
    - edit as follows in the right part
    ```
    ...
    <div class="navbar-menu">
      <div class="navbar-end">
        <router-link to="/dashboard/leads" class="navbar-item">Leads</router-link>

        <div class="navbar-item">
          <div class="buttons">
    ...
    ```
2. **Hide Login/ SignUp buttons when logged in.**
    - wrap the signup and login buttons with a template as followes
    ```
    ...
    <div class="buttons">
        <template v-if="!$store.state.isAuthenticated">
            <router-link to="/sign-up" class="button is-success">
                <strong>Sign up</strong>
            </router-link>
            <router-link to="/log-in" class="button is-info">
                <strong>Log in</strong>
            </router-link>
        </template>
    </div>
    ...
    ```
    - *elaboration*: we are setting enabling to see this buttons, only if the `isAuthenticated` in the store is set to false.
3. **Add a button for MyAccount (Also, in the navbar)**
    - right below the new template we just added, we add another template, which will be the `else` of the `if` from the previous template, which will show us the button of the My Account
    ```
    ...
            <strong>Log in</strong>
        </router-link>
    </template>

    <template v-else>
        <router-link to="/dashboard/my-account" class="button is-info">My Account</router-link>
    </template>
    ...
    ```
4. **Create a page for lead object.**
    - Create `../src/views/dashboard/Lead.vue`
    - Edit is as followes:
    ```
    <template>
    <div class="container">
        <div class="column is-multiline">
            <div class="columns is-12">
                <h1 class="title">
                {{ lead.title }}
                </h1>
                <router-link to="/" class="button is-light">Edit</router-link>
            </div>

            <div class="column is-6">
                <div class="box">
                <h2>Details</h2>
                </div>
            </div>

            <div class="column is-6">
                <div class="box">
                <h2>Contact</h2>
                </div>
            </div>
        </div>
    </div>
    </template>

    <script>
    export default {
        name: "Lead",
        data() {
            return { 
                lead: {}
            };
        },
    };
    </script>
    ```
    - *elaboration*: We have made a page, with a title, an edit button, which at this points lead nowhere and 2 boxes of content, also we defined the lead data object.
5. **Add the `Lead` page to the router**:
    ```
    ...
    import Leads from '../views/dashboard/Lead'
    ...
      {
        path: '/dashboard/leads/:id',
        name: 'Lead',
        component: Lead,
        meta: {
            requiredLogin: true
        }
    },
    ```
    - *elaboration*: **Notice** that we added `:id` in the end of the url, that's because we want the route to be dynamic, meaning the page content will be determined by the id which is transferred to it.
6. **Adding more data to the boxes in the page**:
    - change the two data boxes as follows:
    ```
    <div class="column is-6">
    <div class="box">
        <h2 class="subtitle">Details</h2>
        <hr />
        <p><strong>Status: </strong>{{ lead.status }}</p>
        <p><strong>Priority: </strong>{{ lead.priority }}</p>
        <p><strong>Confidence: </strong>{{ lead.confidence }}</p>
        <p><strong>Estimated value: </strong>{{ lead.estimated_value }}</p>
        <p><strong>Created at: </strong>{{ lead.created_at }}</p>
        <p><strong>Modified at: </strong>{{ lead.modified_at }}</p>
    </div>
    </div>

    <div class="column is-6">
    <div class="box">
        <h2 class="subtitle">Contact</h2>
        <hr />
        <p><strong>Contact Person: </strong>{{ lead.contact_person }}</p>
        <p><strong>Email: </strong>{{ lead.email }}</p>
        <p><strong>Phone: </strong>{{ lead.phone }}</p>
        <p><strong>Website: </strong>{{ lead.website }}</p>
    </div>
    </div>
    ```
    - *elaboration*: We created two boxes of data before, we fill them with tags which will containt the data, and we separate the title from the data, to make it look nice.
7. Adding a function to retrieve the data from the backend.
    - 
    ```
    <script>
    import axios from "axios";
    export default {
    name: "Lead",
    data() {
        return { lead: {} };
    },
    mounted() {
        this.getLead();
    },
    methods: {
        async getLead() {
        this.$store.commit("setIsLoading", true);
        const leadID = this.$route.params.id;
        axios
            .get(`/api/v1/leads/${leadID}/`)
            .then((response) => {
            this.lead = response.data;
            })
            .catch((error) => {
            console.log(error);
            });
        this.$store.commit("setIsLoading", false);
        },
    },
    };
    </script>
    ```
    - *elaboration*: as you can see, there are a few new things here, due the fact that we want the links to be dynamic, and the data retrival to be specific to the lead id, we are using dynamic url to request, meaning we use `.get(`/api/v1/leads/${leadID}/`)`, when using ` instead of ' , you are able to format the string,so we request the specific id.
    we get the id from the url parameters.
8. **Make it possible to edit the lead.**