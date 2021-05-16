

### **Part 1** - Settings the basics:

---
### *Important note, at anypoint after step 3, you can start the application, using `npm run serve` (You have to be inside `ganarcrm_vue`)*
---
1. Install Vue (You will need NPM installed) - `npm install -g @vue/cli`

2. create a project - `vue create ganarcrm_vue --no-git` (*You may ignore the no git, this will just stop the git initialization, it's for myself*)
    - Manually select features
    - features: (Use space to select / Deselect the features)
        - Babel
        - Router
        - Vuex
        - CSS-Pre-proccessors
        - **remove LInter**
    - 3.x 
    - Use History mode? - Y
    - Sass/SCSS (with dart-sass)
    - In Dedicated Config filex
    - Save for future preset? - N

3. `cd ganarcrm_vue` 
4. `npm install bulma axios bulma-toast`
5. Implementing the libraries.
    - adding [axios](https://www.npmjs.com/package/axios) to `ganarcrm_vue/src/main.js`:
    ```
    import { createApp } from 'vue'
    import App from './App.vue'
    import router from './router'
    import store from './store'
    import axios from 'axios'

    axios.defaults.baseURL = 'http://127.0.0.1:8000'

    createApp(App).use(store).use(router,axios).mount('#app')
    ```
6. **Adding [bulma](https://bulma.io/)** to main page (`../src/App.vue`), and removig all the things we don't need.
    - ```
        <template>
            <router-view/>
        </template>

        <style lang="scss">
        @import '../node_modules/bulma';
        </style>
7. **Creating navbar** component.
    - create `layout` directory under `../src/components`
    - create `Navbar.vue` (CamelCase is the way to go) file inside `../src/components/layout`.
    - Copy this [Navbar.vue](https://pastebin.com/PPYFRQ0L)
8. **Adding navbar** to `App.vue`, and adding some things to it.
    - `App.vue`:
    ```
    <template>
        <div>
            <Navbar />
            <section class="section">
                <router-view />
            </section>
        </div>
    </template>

    <script>
    import Navbar from "@/components/layout/Navbar";

    export default {
        name: "App",
        components: {
            Navbar,
        },
    };
    </script>

    <style lang="scss">
    @import "../node_modules/bulma";
    </style>

9. **Creating a simple sign-up page**
    - create SignUp.vue under `../src/views`
    - SignUp page is [here](https://pastebin.com/3bhbtH1d), copy it.
10. **Add SignUp page** to `../src/router/index.js`
    - When adding to index JS, you need to add the import, and the components itself, in [THIS](https://pastebin.com/jPrHQnHt) pastebin, ive marked the two things which you need to add when adding a new component if you need it in the route.
        - The import
        - The component route.
        - *NOTE, in part 2, we add route guard, which will change the code a bit.*
11. **Create the login page** (Basically its the same as the SignUp page, but we remove the confirm password, change the password1 to password, and delete password2 and change the name in the script in the bottom of the page - here is the [LogIn.vue](https://pastebin.com/ShGkmMz6), add it to the router like in the previous step, **Don't fogget the import**
    - ``` 
        {
        path: '/log-in',
        name: 'LogIn',
        component: LogIn
        },
12. Create the `dashboard` directory under `../src/views`
13. inside `../src/views/dashboard/` create [Dashboard.vue](https://pastebin.com/5EK27jWv)
    - Don't forget to add it to the router **And don't forget the import**:
        ```  
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
14. Create [MyAccount.vue](https://pastebin.com/vRuSTENa) under `../src/views/dashboard`, add it to the router just like you did with the Dashboard, under the name MyAccount, and don't forget the imports.
    - ```
        {
        path: '/dashboard/my-account',
        name: 'MyAccount',
        component: MyAccount
        },
15. **Configuring Vuex Store**
    - *The Vuex store is a bunch of functions and variables which will be used all over the application, for example the Token appending, or removing, and the Login validation, each function below will be described and elaborated.*
    - Te vuex store is the `../src/store/index.js` file, we will add functions to it, and mutations.

    - The index.js (store) is found [here](https://pastebin.com/HHt9XsU4) with the elaborations.
16. **Adding the store functions to the views.**
    - in `App.vue` all of the new things below, or just replace the old script block with the new one.
    ```
    <script>
        import Navbar from "@/components/layout/Navbar";
        import axios from "axios"; /* add axios */
        export default {
            name: "App",
            components: {
                Navbar,
        },
        beforeCreate() {
            /* This function will be called on-create of the app */
            this.$store.commit("InitStore"); /* calling the store initialization */

            if (this.$store.state.token) {
            /* If there is a token in the store state, we will set a token for axios */

                axios.defaults.headers.common["Authorization"] =
                    "Token " + this.$store.state.token;
            } else {
                /* If there's no token is the store, we will not get       authorization */

                axios.defaults.headers.common["Authorization"] = "";
            }
        },
        };
    </script>

17. **Adding router guard**
    - add `import store from '../store` to router index.js
    - go to the buttom of the page in the router file.
    - above `export default router` add the following code:
        - ```
            router.beforeEach((to, from, next) => {
                if (to.matched.some(record => record.meta.requiredLogin) && !store.state.isAuthenticated) {
                /* This if checks if we are logged in, if not, it will send us to login */
                next('/log-in')
            } else {
                /* if we are logged in, it will send us to the page we requested */
                next()
            }
            })
    - Add `meta` fields to the components (not all of them, only the ones that by logic wil lrequire to to be logged in to use them), at this point, its only these two:
    ```  
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
        requiredLogin: true
        }
    },
    {
        path: '/dashboard/my-account',
        name: 'MyAccount',
        component: MyAccount,
        meta: {
        requiredLogin: true
        }
    },


18. **We should be done here**, you you did everything correct, and you started the app, you should navigate to login / signup / home pages, but when you will try to go to dashboard or dashboard/my-account you will get redirected to login.