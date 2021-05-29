### **Part 3** - Adding leads and making modifications:

---

1. **Let's build a loading bar.**
    - *remmber the `isLoading` functions in the mutation functions ofhte store on the vue side? we will use it now.*
    - open `../src/views/App.vue` and add the following code just below the <Navbar/>
        - 
        ```
        <div class="is-loading-bar has-text-centered" v-bind:class="{ 'is-loading': $store.isLoading }">
            <div class="lds-dual-ring"></div>
        </div>
        ```
        - *Whats going on?*:
            - if `$store.isLoading` will return true, then `is-loading` will be appended to the current class, it will transofrm `is-loading-bar has-text-centered` into `is-loading-bar has-text-centered is-loading`, meaning that the loading bar status is managed now by the store variable.
            - `<div class="lds-dual-ring"></div>` is a loading icon, you can select other ones from [here](https://codepen.io/DariaIvK/pen/EpjPRM) if you wish.
2. **Some modifications for the loading bar**
    - *We want to hide the loading bar when we dont need it and modify it a bit*
    - under `@import "../node_modules/bulma";` on the button of `App.vue` add the following:
        
        ```
        /* some design and positioning for the ring */

        .lds-dual-ring {
            display: inline-block;
            width: 80px;
            height: 80px;
        }
        ```
        
        ```
        /* some design for the ring */

        .lds-dual-ring:after {
            content: " ";
            display: block;
            widows: 64px;
            height: 64px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid #ccc;
            border-color: #ccc transparent #ccc transparent;
            animation: lds-dual-ring 1.2 linear infinite;
        }
        ```

        ```
        /* this will rotate the ring , at 0% it's on 0degrees, when completed, its on 360 degrees, so its spinning*/

        @keyframes lds-dual-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        ```
        ```
        /* hidding and showing the loading bar, when is-loading is not appended, the heigh of the bar is 0, when it's appended, the loading bar shows at 80px*/

        .is-loading-bar {
            height: 0;
            overflow: hidden;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;

            &.is-loading {
                height: 80px;
            }
        }
        ```true
3. let's impelemnt the mutation of `isLoading` in `../src/views/LogIn.vue`
    - make the `submitForm()` function async, ny adding the word async before it, and add `isLoading` call, which will mutate the variables value so it looks like this:
        ```
        ...
        methods: {
        async submitForm() {
            /* this will change the isLoading to true, and will show the loading bar*/
            this.$store.commit('setIsLoading', true)

            axios.defaults.headers.common["Authorization"] = "";
            localStorage.removeItem("token");
        ...
        ```
        add `await` before the axios
        ```
        ...
        await axios
            .post("/api/v1/token/login/", formData)
            .then((response) => {
        ...
        ```
        **AT THE END** of the execution of axios (outisde of the scope of the axios call), you add the following 
        *this will turn the isLoading to false, and hide the loading bar*
        ```
        this.$store.commit('setIsLoading', false)
        ```

        the `LogIn.vue` page should look like [this](https://pastebin.com/ppDWZgq0) in the end.
4. Do exactly the same thing in the `SignUp.vue` file.
    - `SignUp.vue` show look like [this](https://pastebin.com/PrLgmeea) in the end.
5. Create leads app - `python manage.py startapp lead` (while inside `ganarcrm_django`)
6. Creating lead model for database.
    - open `ganarcrm_django/lead/models.py`, add the lead model:
    ```
    from django.contrib.auth.models import User
    from django.db import models
    from django.db.models.base import Model
    from django.db.models.deletion import CASCADE


    class Lead(models.Model):
        NEW = 'new'
        CONTACTED = 'contacted'
        INPROGRESS = 'inprogress'
        LOST = 'lost'
        WON = 'won'

        CHOICES_STATUS = (
            (NEW, 'New'),
            (CONTACTED, 'Contacted'),
            (INPROGRESS, 'Inprogress'),
            (LOST, 'Lost'),
            (WON, 'Won')
        )

        LOW = 'low'
        MEDIUM = 'medium'
        HIGH = 'high'

        CHOICES_PRIORITY = (
            (LOW, 'Low'),
            (MEDIUM, 'Medium'),
            (HIGH, 'High')
        )

        company = models.CharField(max_length=255)
        contact_person = models.CharField(max_length=255)
        email = models.EmailField()
        phone = models.CharField(max_length=255)
        website = models.CharField(max_length=255)
        confidence = models.IntegerField(blank=True, null=True)
        estimated_value = models.IntegerField(blank=True, null=True)
        status = models.CharField(
            max_length=25, choices=CHOICES_STATUS, default=NEW)
        priority = models.CharField(
            max_length=25, choices=CHOICES_PRIORITY, default=MEDIUM)
        created_by = models.ForeignKey(
            User, related_name='leads', on_delete=CASCADE)
        created_at = models.DateTimeField(auto_now_add=True)
        modified_at = models.DateTimeField(auto_now=True)

    ```
7. add the lead app to django settings (`garancrm_django/settings.py`):
    ```
    INSTALLED_APPS = [
    ....
    'corsheaders',
    'djoser',
    'lead.apps.LeadConfig' # <- add this
    ]
    ```
8. update the database
    - `python manage.py makemigrations`
    - `python manage.py migrate`
9. adding Serializers (They transform the objects into a readable objects for DRF from Django)
    - under `ganarcrm_django/lead` create `serializers.py`
    - create a serializer for lead
    - You can read about [read_only_fields](https://www.django-rest-framework.org/api-guide/fields/#readonlyfield) in detail, on the high level - A field class that simply returns the value of the field without modification.
        ```
        class LeadSerializer(serializers.ModelSerializer):
        class Meta:
            model = Lead
            read_only_fields = (
                'created_by',
                'created_at',
                'modified_at'
            )
            fields = (
                'id',
                'company',
                'contact_person',
                'email',
                'phone',
                'website',
                'confidence',
                'estimated_value',
                'status',
                'priority',
            )

        ```
10. View for leads
    - open `ganarcrm_django/lead/views.py`
    - change the code as follows
    ```
    from django.shortcuts import render
    from rest_framework import viewsets

    from .models import Lead
    from .serializers import LeadSerializer


    class LeadViewSet(viewsets.ModelViewSet):
        serializer_class = LeadSerializer
        queryset = Lead.objects.all()

        def get_queryset(self):
            return self.queryset.filter(created_by=self.request.user)

    ```
    - *elaboration* : *we set a view for the serializer, the filtering over there means that we will get only the leads which are created by the current logged in user.*
11. Set up the URLS.
    - create `ganarcrm_django/lead/urls.py` and open it
    - change it as follows:
        ```
        from django.conf.urls import url
        from django.urls import path, include
        from rest_framework import urlpatterns
        from rest_framework.routers import DefaultRouter
        from .views import LeadViewSet

        router = DefaultRouter()
        router.register('leads', LeadViewSet, basename='leads')

        urlpatterns = [
            path('', include(router.urls)),
        ]

        ```
    - *elaboration* : *Here we registered the LeadViewSet, as leads for the rest api*
12. add the following path at the end in `ganarcrm_django/ganarcrm_django/urls.py`
    -  `path('api/v1/', include('lead.urls'))`
    - *elaboration* : adding the view into the router.
13. Creating a page for showing leads
    - under `gabarcrm_vue/src/views/dashboard` create `Leads.vue`
    - add basic page template as follows:
    ```
    <template>
    <div class="container">
        <div class="colums is-multiline">
            <div class="column is-12">
                <h1 class="title">Leads</h1>
            </div>
        </div>
    </div>
    </template>

    <script>
        export default {
        name: "Leads",
        };
    </script>
    ```
14. Add the page to the router (`router/index.js`)
    - add the import, and the route
    ```
    ...
    import Leads from '../views/dashboard/Leads'
    ...
    {
        path: '/dashboard/leads',
        name: 'Leads',
        component: Leads,
        meta: {
            requiredLogin: true
        }
    },
    ...
    ```
15. updating authentication in `ganarcrm_django/ganarcrm_django/settings.py`
    - We need this settings to make the authentication work properely, add this below CORS_ALLOWERD_ORIGINS list.
    ```
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework.authentication.TokenAuthentication',
        ),
        'DEFAULT_PERMISSION_CLASSES': (
            'rest_framework.permissions.IsAuthenticated',
        )
    }
    ```
16. Updaing `Leads.vue`:
    - *Ill devide this into 2 parts, in the end you can see a link to the full page.

    - Script:
    ```
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
    ```
    - *elaboration*: We create an empty data array, which contains leads, and a functions `getLeads`, the function will call the django api and return data.
    before this happens, we set the loading status `isLoading` to true, so we can see that the data is loading, after we get the data, we set it to false.

    - Template:
    ```
    <template>
        <div class="container">
            <div class="colums is-multiline">
                <div class="column is-12">
                    <h1 class="title">
                    Leads
                    <router-link to="/dashboard/leads/add" class="button is-light">
                        + Add lead
                        </router-link>
                    </h1>
                </div>

                <div class="column is-12">
                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="lead in leads" v-bind:key="lead.id">
                            <td>
                                <router-link :to="{ name: 'Lead', params: { id: lead.id } }">
                                    <strong>{{ lead.company }}</strong>
                                </router-link>
                            </td>
                            <td>{{ lead.contact_person }}</td>
                            <td>{{ lead.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </template>
    ```
    - *elaboration*: The template recieves the data about the leads that are connected to the specific user which is logged in.
    - The table has a `<tr>` which iterates on each lead, which will fill the table that we have created.
    - we have added a button which will allow us to add leads (will redirect to another route)
    - [Full page](https://pastebin.com/QdfmGp20) on pastebin
    - **NOTE** - 
    about this `<td>`, in this line we are adding a redirections to the specific lead view, this will be used in the future to redirect to the page, using the ID of the lead.
    ```
    <td>
        <router-link :to="{ name: 'Lead', params: { id: lead.id } }">
            <strong>{{ lead.company }}</strong>
        </router-link>
    </td>
    ```
17. Add `AddLead.vue` (also under `../dashboard`) and make a simple template
    ```
    <template>
    <div class="container">
        <div class="colums is-multiline">
            <div class="column is-12">
                <h1 class="title">Add lead</h1>
            </div>
        </div>
    </div>
    </template>

    <script>
        export default {
        name: "AddLead",
    };
    </script>
    ```
    - add it to the router (`../router/index.js`)
    ```
    import AddLead from '../views/dashboard/AddLead'
    ...
    {
        path: '/dashboard/leads/add',
        name: 'AddLead',
        component: AddLead,
        meta: {
            requiredLogin: true
        }
    },
    ...
    ```
18. Adding creation form to `AddLead.vue`
    - the code is long, so I've pasted it [here](https://pastebin.com/8Acwjhii) **IT DOES NOT HAVE THE SENDING INFORMATION YET**
    - *elaboration*: This may look scary and long, but its just a simple form, the only new thing that we have added here, is the selection input type
    ```
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
    ```
    which just allows us to select an input instead of writing it, the rest is just a normal form, just like the login we did, but for all of the form that you can find the in the script block.
    ```
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
    ```
    - as you can see, we added some default values.
19. To make this work, we will need to create a small modification on `ganarcrm_django/lead/views.py`
    - update the class:
    ```
    class LeadViewSet(viewsets.ModelViewSet):
        serializer_class = LeadSerializer
        queryset = Lead.objects.all()

        def get_queryset(self):
            return self.queryset.filter(created_by=self.request.user)

        def perform_create(self, serializer):
            serializer.save(created_by=self.request.user)

    ```
    
    - *elaboration*:
    ```
    perform_create(self, serializer) - Called by CreateModelMixin when saving a new object instance.
    ```
    
20. Making the form to actually create the Lead.
    - on `AddLead.vue` go to the script section, and edit as followes.
    ```
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
    ```
    - *elaboration*: we created a functions, that will send the data which is taken from the fields we fill, and will send it to the backend, also you can notice that again, we use the loading status, to manage the loading bar, after the data is sent to the backend, we print the response in the console, and redirect back to the leads list, after the redirection, we set the `isLoading` to false again.


## At this point, you should be able to create leads, with your account, and view them in the table of the leads.