### **Part 6** - Memmbers and a few updates.

1. **Updating the `lead` model**
    
    We are updating the lead model so we can add teams.
    - add an import to the model script
        ```
        from team.models import Team
        ```
    - add a new field 
        ```
        ....
        team = models.ForeignKey(Team, related_name='leads', on_delete=models.CASCADE) <- Add this field.
        company = models.CharField(max_length=255)
        .....
        ```
    - `makemigrations...migrate`
    - the console will ask you to input a default value, input 1 and then 1 again.

2. **Fix the lead query**
    - Now we want to make the lead get request to return all fo the lead connected to the team, and not only the leads of the user.
    - open `lead/views.py`
    - change the functions, and add the model import
    ```
    from team.models import Team
    ...
    def perform_create(self, serializer):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        serializer.save(team=team, created_by=self.request.user)

    def get_queryset(self):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        return self.queryset.filter(team=team)
    ```
    - Now when a lead is created is appended to the team, and also when we request for the leads, we get all of the leads which are related to the team.
3. **Fixing the team viewset**
    - open `team/views.py`
    - fix `get_queryset`
    ```
        def get_queryset(self):
        return self.queryset.filter(members__in=[self.request.user])
    ```
    - fix `get_my_team`
    ```
    @api_view(['GET'])
    def get_my_team(request):
        team = Team.objects.filter(members__in=[request.user]).first()
        serializer = TeamSerializer(team)
        return Response(serializer.data)
    ```
4. **Updating team serializer**
    - open `team/serializers.py`
    - fix the serializers class - now we will have the team creator.
    ```
    class TeamSerializer(serializers.ModelSerializer):
        members = UserSerializer(many=True, read_only=True)
        created_by = UserSerializer(read_only=True)

        class Meta:
            model = Team
            fields = (
                "id",
                "name",
                "members",
                "created_by"
            )

    ```
5. Log in and Logout to check that everything is okay untill now.

6. **Creating a page to view the team**
    - create `../src/views/dashboard/Team.vue`
    - create a simple template
    ```
    <template>
        <div class="container">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <h1 class="title">Team</h1>
                </div>

                <div class="column is-12">

                </div>
            </div>
        </div>
    </template>

    <script>
        export default {
            name: 'Team'
        }
    </script>
    ```
    - Import it to the router.
    ```
    ...
    import Team from '../views/dashboard/Team'
    ...
    {
    path: '/dashboard/team',
    name: 'Team',
    component: Team,
    meta: {
      requiredLogin: true
    }
    ...
    ```
7. **Verify and add to navbar.**
    - verify that the link is working by going to http://localhost:8080/dashboard/team
    - if it works, open `../src/components/layout/Navbar.vue`
    - add a new link below the Leads link
    ```
    ...
    <router-link to="/dashboard/leads" class="navbar-item">Leads</router-link>
    <router-link to="/dashboard/team" class="navbar-item">Team</router-link>
    ...
    ```
    - Great, now we a have a navigation link to the Team page.
8. **Modify Team page**
    - goto `Team.vue`
    - Change the template (Nothing new here, we are just adding a table like we did before with the leads, but for the team members, the source of data will be in the next section.)
    ```
    <template>
        <div class="container">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <h1 class="title">Team</h1>
                </div>

                <div class="column is-12">
                    <h2 class="subtitle">Members</h2>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="member in team.members" v-bind:key="member.id">{{member.username}}</tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </template>
    ```
    - **Getting the data** - change the script section, again nothing new here, just creating an empty array of members, and creating the function for getting team members.
    ```
    <script>
        import axios from 'axios'

        export default {
            name: 'Team',
            data() {
                return {
                    team: {
                        members: [],
                    }
                }
            },
            mounted(){
                this.getTeam()
            },
            methods: {
                async getTeam() {
                }
            }
        }
    </script>
    ```
9. Check that everything is working, you should see an empty table.
10. Actually getting the team members data.
    - edit the `getTeam()`, we will just get the team data, nothing new here also, but you will see the team members, at this point should be only you.
    ```
    methods: {
            async getTeam() {
                this.$store.commit("setIsLoading", true);

                await axios
                    .get("/api/v1/teams/get_my_team/")
                    .then((response) => {
                        this.team = response.data
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.$store.commit("setIsLoading", false);
            }

        }
    ```
    - Also you can cahnge the title of the page now to contain the name of the team.
    ```
    <div class="column is-12">
        <h1 class="title">{{team.name}}</h1>
    </div>
    ```
11. **Making it possible to add members**
    - create `../src/views/dashboard/AddMember.vue` and create the default template.
    ```
    <template>
    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Add Member</h1>
            </div>
        <div class="column is-12"></div>
        </div>
    </div>
    </template>

    <script>
        import axios from "axios";
        export default {
            name: "AddMember",
        };
    </script>
    ```
    - Add everything to the router.
    ```
    import AddMember from '../views/dashboard/AddMember'
    ...
    {
        path: '/dashboard/team/add-member',
        name: 'AddMember',
        component: AddMember,
        meta: {
        requiredLogin: true
            }
    },
    ```
    - validate that the page is working by going to the url, http://localhost:8080/dashboard/team/add-member
    - Open the `Team.vue` page, and add a router-link to the page under the title.
    ```
          <div class="column is-12">
        <h1 class="title">
          {{ team.name }}
          <router-link :to="{ name: 'AddMember' }" class="button is-light">+ Add member</router-link>
        </h1>
      </div>
    ```