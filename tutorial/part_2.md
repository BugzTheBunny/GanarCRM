### **Part 2** - Settings the basics (Django):

---

1. Install virtualenv - `pip install virtualenv`
2. create a virualenv - `virtualenv env_3_8`
3. start `env_3_8` - Depends on your OS, run the enviroment
4. Installing the libraries:
    - `pip install django django-rest-framework django-cors-headers djoser`
5. Create django project - `django-admin startproject ganarcrm_django`
6. Adding libraries in `ganarcrm_django/settings.py`
    - ```
        ALLOWED_HOSTS = []

        CORS_ALLOWED_ORIGINS = [
            'http://localhost:8080'
        ]
        # Application definition

        INSTALLED_APPS = [
            ...
            'django.contrib.staticfiles',
            'rest_framework',
            'rest_framework.authtoken',
            'corsheaders',
            'djoser'
        ]
    - ```
        MIDDLEWARE = [
        ...
        'django.contrib.sessions.middleware.SessionMiddleware',
        'corsheaders.middleware.CorsMiddleware', # <- Add this exactly here
        'django.middleware.common.CommonMiddleware',
        ...
    ]
7. Adding Djoser to `ganarcrm_django/urls.py`
    - ```
        from django.contrib import admin
        from django.urls import path, include

        urlpatterns = [
            path('admin/', admin.site.urls),

            path('api/v1/', include('djoser.urls')),
            path('api/v1/', include('djoser.urls.authtoken')),

        ]
8. Initialize database:
    - `python manage.py makemigrations`
    - `python manage.py migrate`
9. `python manage.py createsuperuser`
10. run server - `python manage.py runserver`
    - You can try to log in in `http://localhost:8000/admin` and take a look at the admin view
11. Make it possible to sign up from the frontend
    - open `ganarcrm_vue/src/views/SignUp.vue`
    - change the ```<form>``` to ```<form @submit.prevent="submitForm">```
        - *This will prevent the default behaviour of the HTML*
    - at the bottom of the page, add some things to the script tag
        - ```
            <script>
            export default {
            name: "SignUp",
            methods: {
                submitForm() {
                console.log("submit test");
                },
            },
            };
            </script>
        - test the Sign Up button at the signup page, and check the console, if it prints 'submit test' then everything is fine!
    - We will add v-models in the singup page, to the inputs.
        - *the v-model will allow us to use the inputs and interact with them*
        - ```
            ...
            <div class="control">
            <input type="text" name="email" class="input" v-model="username"/>
            </div>
            ...
        - ```
            ...
            <div class="control">
            <input type="password" name="password1" class="input" v-model="password1"/>
            </div>
            ...
        - ```
            ...
            <div class="control">
            <input type="password" name="password2" class="input" v-model="password2"/>
            </div>
            ...
    - add the following to the script tag
        - *This will allow us to read the v-models we set above and we added `axios` to interact with the backend, also added `toast` for the notifications*
        - ```
            <script>
            import axios from 'axios' /* New */
            import {toast} from 'bulma-toast' /* New */

            export default {
            name: "SignUp",
            data() { /* New! */
                return { /* New! */
                username: "", /* New! */
                password1: "", /* New! */
                password2: "", /* New! */
                };
            },
            methods: {
                submitForm() {
                console.log("submit test");

                console.log(username) /* New! */
                },
            },
            };
            </script>
        - you can see console.log(username), this will show you how the interaction will work, fill the Email field, and watch the conlose aftery ou submit the form, it should print the Email you have inputed, if not, something is wrong.
12. Adding notifications
    - *This is where the notifications will be desplayed, we will get the data for the notifications from the backend, they are default messages set by Django / Djoser*
    - add the following code between the password2 and the Sign up button field.
    - ```
        ...

        <!-- Notifications (Add This above the button)--> 
        <div class="notification is-danger" v-if="errors.length"> 
            <p v-for="error in errors" v-bind:key="error">
                {{ error }}
            </p>
        </div>

        <!-- Submit form -->
        <div class="field">
            <div class="control">
                <button class="button is-success">Sign Up</button>
        ...
        ```
        - *elaboration*:
            - `v-if="errors.length"` - checks if there are errors sent from the backend, if the length is more than 0, it will be true, therefore will show the errors
            - `v-for="error in errors"` - this means that for every error `{{error}}` will be appended to the text of the `p` tag.
            - `v-bind:key="error"` binding / mapping (read more [here](https://vuejs.org/v2/guide/list.html))
13. add `errors: []` to the `data()`
    - ```
         data() {
            return {
                username: "",
                password1: "",
                password2: "",
                errors: [], /* New */
            };
14. Actually making it to work (**Validation**).
    - update the `submitForm()` functions as follows
    - ```
        submitForm() {
            this.errors = [];

            if (this.username == "") {
                this.errors.push("The username is missing");
            }

            if (this.password1 == "") {
                this.errors.push("The password is too short");
            }

            if (this.password1 != this.password2) {
                this.errors.push("The password do not match");
            }
        },
       ```
        - elaboration:
            -  `this.errors = [];` - initialize errors list
            - the `if`s checks the input, that's pretty simple, and if any of the ifs is found, an error will be added to the errors list, and will be shown in the notifications, because the list is grown.
15. Actually making it to work (**Sending data to backend**).
    - update the `submitForm()` functions as follows (Add another if)
    - ```
        if (!this.errors.length) {
            const formData = {
            username: this.username,
            password: this.password1,
            };

            axios
            .post(`/api/v1/users/`, formData)
            .then((response) => {
                toast({
                message: "Account has been created, you may log in.",
                type: "is-success",
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: "bottom-right",
                });

                this.$router.push("/log-in");
            })
            .catch((error) => {
                if (error.response) {
                for (const property in error.response.data) {
                    this.errors.push(
                    `${property}: ${error.response.data[property]}`
                    );
                }
                } else if (error.message) {
                this.errors.push("Something went wrong..");
                }
            });
        }
        ```
        - elaboration
            - checking if there are any errors
            - if no errors, creating `formData` const, which will be sent to the backend
            - posting the `formData` via `axios` to the backend to `/api/v1/users/` (The begining of the link is the one we defined in `main.js` > `axios.defaults.baseURL = 'http://127.0.0.1:8000'`)
            - if we get a response we create a notification using toast, and we define it as we wish
                - `message`: The message we want to desplay,
                - `type`: the type of the message (design),
                - `dismissible`: if we want it to dissapear,
                - `pauseOnHover`: if we want it to say while we hover on it,
                - `duration`: time before dissapear,
                - `position`: position of the notification,
            - `this.$router.push("/log-in")` - sends us to login screen after the notification is gone.
            - in the **catch** section, if we get there, we will get a response of errors.
            so we loop on them, and add them to the errors list, which will be in the errors filed.
            - if we get some wierd error, which is not coming from the backend, we will add a custom error. `this.errors.push("Something went wrong..");`
    - **At this point, you should be able to register via the frontend**
16. Making the Log-in work