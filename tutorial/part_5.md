### **Part 5** - Adding teams and using Vuex

1. Creating Team app and adding it.
    - `python manage.py startapp team`
    - open `team/models.py`
    - create a models:
        ```
        from django.contrib.auth.models import User
        from django.db import models


        class Team(models.Model):
            name = models.CharField(max_length=255)
            members = models.ManyToManyField(User, related_name='teams')
            created_by = models.ForeignKey(User, on_delete=models.CASCADE)
            created_at = models.DateField(auto_now_add=True)

        ```
    - Add it to the settings.py
        ```
        INSTALLED_APPS = [
            ...
            'corsheaders',
            'djoser',
            'lead.apps.LeadConfig',
            'team.apps.TeamConfig'
        ]
        ```
    - `python manage.py makemigrations`
    - `python manage.py migrate`

2. Create serializer for Teams
    - create `serializers.py` inside `team`
        ```
        from django.contrib.auth.models import User
        from django.db import models
        from django.db.models import fields
        from rest_framework import serializers
        from .models import Team


        class UserSerializer(serializers.ModelSerializer):
            class Meta:
                model = User
                fields = (
                    "id",
                    "username",
                    "first_name",
                    "last_name"
                )


        class TeamSerializer(serializers.ModelSerializer):

            members = UserSerializer(many=True, read_only=True)

            class Meta:
                model = Team
                fields = (
                    "id",
                    "name",
                    "members"
                )

        ```
    - *elaboration*: We created 2 seriealizers, 1 for User, because we will be interacting with the users, so we need to serialize them so we created `UserSerializer`, also we created `TeamSerializer` to interact with it, the new thing that you can see, is the members field, we made it a bit custom, we set `many` to `true`, becase we will have many users in a team, and we made it `read_only`, because we don't want the option of adding new users via the teams view, so we just want to get the inofrmation when we see it.

3. Adding view for Team.
    - open `team/views.py`
    ```
    from rest_framework import viewsets
    from rest_framework.generics import CreateAPIView

    from .models import Team
    from .serializers import TeamSerializer


    class TeamViewSet(viewsets.ModelViewSet):
        serializer_class = TeamSerializer
        queryset = Team.objects.all()

        def get_queryset(self):
            return self.queryset.filter(created_by=self.request.user)

        def perform_create(self, serializer):
            obj = serializer.save(created_by=self.request.user)
            obj.members.add(self.request.user)
            obj.save()
    ```
    - *elaboration*: We created a view set for the Team, we edited the `get_queryset` to return only the teams that created by the user which is logged in.
    on creation of the team, we set the team `created_by` to the user which is logged in, and we added him to the members list of the team, and then save the team item.
4. Adding urls of team.
    - create `team/urls.py`
    ```
    from django.conf.urls import url
    from django.urls import path, include
    from rest_framework import urlpatterns
    from rest_framework.routers import DefaultRouter
    from .views import TeamViewSet

    router = DefaultRouter()
    router.register('teams', TeamViewSet, basename='teams')

    urlpatterns = [
        path('', include(router.urls)),
    ]

    ```
    - open `ganarcrm_django/ganarcrm_django/urls.py`
    - add `path('api/v1/', include('team.urls'))`
5. After were done with that, we will add the user data to the Vuex (store)
    - open `src/store/index.js`
    - add `user` to `state`, this will be the initial data.
    ```
    ...
    state: {
        isLoading: false,
        isAuthenticated: false,
        token: '',
        user: {
            id: 0,
            username: ''
        }
    },
    ...
    ```
    - add getting username and id from local storage in `initStore`.
    - add `state.user.username = localStorage.getItem('username')`
    - add `state.user.id = localStorage.getItem('userid')`
    - and add the `state.user.id` and `state.user.username` in the else block.

    ```
    initStore(state) {
        ...
            state.token = localStorage.getItem('token')
            state.isAuthenticated = true
            state.user.username = localStorage.getItem('username')
            state.user.id = localStorage.getItem('userid')

        } else {
        ...
        state.isAuthenticated = false
        state.user.id = 0
        state.user.username = ''
        ...
    ```
    - *elaboration*: We made it so, that when the application starts, we get try to get the user id and username from the local storage, if we dont have a token there, then we will set the id to 0 and the username to nothing.

    - add a new function in the mutations below the `removeToken(state)` function
    ```
    removeToken(state) {
      ....
    },
    setUser(state,user){
      state.user = user
    }
    ```
6. Add the new function to LogIn.vue, to make the login save the data in the local storage, for further user.
    - Add a new axios call under the previous axios call.
    ```
    await axios
        .get("/api/v1/users/me")
        .then((response) => {
          this.$store.commit("setUser", {
            id: response.data.id,
            username: response.data.username,
          });

          localStorage.setItem("username", response.data.username);
          localStorage.setItem("id", response.data.username);

          this.$router.push("/dashboard/my-account");
        })
        .catch((error) => {
          console.log(error);
        });
    ```
     - *elaboration*: we call for the user data the `users/me` is a built in djoser url, which will retrun the data about the currently logged in user, then we use this data to call the function of setUser, and to save the data in the local storage, **NOTE** that we removed the `this.$router.push("/dashboard/my-account");` from the first call, and moved it to the second one, so we will get redirected only after the second call.

7. Add Team name and Team id.
    - add team object to the store.
    ```
    ...
    user: {
      id: 0,
      username: ''
    },
    team: {
      id: 0,
      name: ''
    }
    ...
    ```
    - add the mutations of the team.
    ```
    ...
        state.user.username = localStorage.getItem('username')
        state.user.id = localStorage.getItem('userid')
        state.team.id = localStorage.getItem('team_id')
        state.team.name = localStorage.getItem('team_name')


      } else {
        ...
        state.user.id = 0
        state.user.username = ''
        state.team.id = 0
        state.team.name = ''
    ...
    ```
    - create mutation function after the `setUser`.
    ```
        setTeam(state, team) {
            state.team = team

            localStorage.setItem('team_id', team.id)
            localStorage.setItem('team_name', team.name)

        }
    ```
7. Redirect the user if he does not have a team.
    - open `App.vue`
    - inside beforeCreate, after the else statement, add another if, this will redirect us to `add-team` page, which we did **not create** yet.
    ```
    ...
    } else {
      axios.defaults.headers.common["Authorization"] = "";
    }

    if (!this.$store.state.team.id) {
      this.$router.push("/dashboard/add-team");
    }
    ...
    ```
8. Create page for adding teams.
    - create `src/views/dashboard/AddTeam.vue`
    - add a default template
    ```
    <template>
    <div class="container">
        <div class="colums is-multiline">
            <div class="column is-12">
                <h1 class="title">Add team</h1>
            </div>
        </div>
    </div>
    </template>

    <script>
    import axios from "axios";
    import { toast } from "bulma-toast";

    export default {
        name: "AddTeam",
        data() {},
        methods: {},
    };
    </script>
    ```
    - Add everything we need to the router as always.
    ```
    ...
    import AddTeam from '../views/dashboard/AddTeam'
    ...
    {
        path: '/dashboard/add-team',
        name: 'AddTeam',
        component: AddTeam,
        meta: {
            requiredLogin: true
        }
    },
    ...
    ```
9. Adding a from to `AddTeam`.
    - in this form we need only team name at this point.
    ```
    ...
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
    ...
    ```
    - Add submitForm function for adding teams
    - There is nothing new over here, pretty much a copy of the previous forms, but much simpler.
    ```
    export default {
    name: "AddTeam",
    data() {
        return {
        name: "",
        };
    },
    methods: {
        async sumitForm() {
        this.$store.commit("setIsLoading", true);
        const team = {
            name: this.name,
        };
        await axios
            .post("/api/v1/teams", team)
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

            this.$router.push("/dashboard/my-account");
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
    - **At this point** you should be able to add teams.
9. Fixing loging to implement teams.
    - Open `ganarcrm_django/team/views.py`
    add the following:
    ```
    from rest_framework.decorators import api_view
    from rest_framework.response import Response
    ...
    # This should be added after the class!
    @api_view(['GET'])
    def get_my_team(request):
        team = Team.objects.filter(created_by=request.user).first()
        serializer = TeamSerializer(team)
        return Response(serializer.data)
    ...
    ```
    - *elaboration*: we created a function which will return the team of the currently logged user, we wrap the data with serialization, and return a response of the data.

    - Add the url of the function above inside `teams/urls.py`.
    - add `path('teams/get_my_team/', get_my_team, name='get_my_team')`
    - **It's important that it will be above the other path.**
    ```
    urlpatterns = [
        path('teams/get_my_team/', get_my_team, name='get_my_team'),
        path('', include(router.urls)),
    ]
    ```
10. Adding another `axios` call into `LogIn.vue`
    - we moved the redirection down again to the new function.
    - This function will return the team data from the backend.
    ```
    ...
      await axios
        .get("/api/v1/teams/get_my_team/")
        .then((response) => {
          this.$store.commit("setTeam", {
            id: response.data.id,
            name: response.data.name,
          });

          this.$router.push("/dashboard/my-account");
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
    ...
    ```
11. Fixing logout.
    - We need to remove username, userid, and team just like we remove the token.
    - open `MyAccount.vue`
    go to the script section, and add the things just like below:
    ```
    ...
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("token");

      localStorage.removeItem("username");
      localStorage.removeItem("userid");
      localStorage.removeItem("team_name");
      localStorage.removeItem("team_id");

      this.$store.commit("removeToken");

      this.$router.push("/");
    ...
    ```
12. Bonus, you can add 
```
console.log(`Logged in as ${this.$store.state.user.username} | ${this.$store.state.team.name}`
```
in App.vue under the `beforeCreate()`
```
beforeCreate() {
    this.$store.commit("initStore");

    console.log(
      `Logged in as ${this.$store.state.user.username} | ${this.$store.state.team.name}`
    );
```
 in order to see the current data.

 ### Done with part 5.