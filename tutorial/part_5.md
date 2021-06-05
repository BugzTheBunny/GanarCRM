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


        class UserSerializer(serializers.Serializer):
            class Meta:
                model = User
                fields = (
                    "id",
                    "username",
                    "first_name",
                    "last_name"
                )


        class TeamSerializer(serializers.Serializer):

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
    router.register('leads', TeamViewSet, basename='teams')

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
5. Add the new function to LogIn.vue, to make the login save the data in the local storage, for further user.
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

6. Add Team name and Team id.
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
