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


    class Lead():
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
        CREATED_AT = models.DateTimeField(auto_now_add=True)
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