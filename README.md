# Ganar CRM Demo & Tutorial
### This is a text tutorial of Django 3 (DRF) with Vue3 CLI combined.


#### Finished:
Done, kind of, only boring repetetive stuff are left, so starting the [next tutorial](https://www.youtube.com/watch?v=RXSzhuYeYOI&list=PLpyspNLjzwBk3oofmtqs0KMD3DY9BjNwp&ab_channel=CodeWithStein) 

Original Tutorial is [HERE](https://www.youtube.com/watch?v=7rxHWX730nE&list=PLpyspNLjzwBl-u7Vh8mGfqqRKcVxHzqlp&index=2) (Made by Code With Stein (`Subscribe to him, he is awesome`))

**I'm making this for myself for the future, and for more practice.
and maybe someone will find a text version faster (Steins videos are fast enough in my opinion)**

*Some of the code will be on pastebin / you will get refference to the video to save space in this document*

The tutorial is split into a few parts, each part will explain each video in text.


### Start app:

#### Vue:
    - `npm run serve`


#### Django:
    - `python manage.py runserver`
-----
### `You may find the tutorial parts inside the tutorial directory`
Things used in this tutorial (Will be updated)
## *Backend*
- **Python 3.x** - *(3.8 for myself)*
- **Django 3** - *An amazing backend framework we will be using*
- **django-rest-framework** - *this will turn Django into a great API.*
- **djoser** - REST implementation of Django authentication system. djoser library provides a set of Django Rest Framework views to handle basic actions such as registration, login, logout, password reset and account activation. 
- **django-cors-headers** - *fixes cors problems*
- ...
    
## *Frontend*
- **Vue3 CLI** - *We will be using VUE3 as a frontned framework for the app*
- **Bulma** - *CSS framework (You may select another if you wish)*
- **Axios** - *Ajax Management package*
- **Bulma-toast** - *This helps us to show notifications*
- ... 

--- Update 08/01/22:
- Starting the course from the begining.
- Removed all of the code, left the tutorials only, which will be fixed when needed
-----

## Done:

**Part 1**:
- **Initialization of the project**.
    - creating the project.
    - adding libraries
    - creating SignUp / LogIn / Navbar / Dashboard / MyAccount pages.
    - basic configuration of the store
    - added basic router guard.

**Part 2**:
- **Initialization of the backend**
    - installing libs
    - creating a project
    - configuring the backend

- **Integration of the backend with the frontend**
    - Making the Signup work from the frontend
    - Making the Login work from the frontend
    - Making Logout possible via frontend

**Part 3**:
- **Adding Leads to the app, and some features**
    - Adding loading bar
    - Creating Lead model, serializers, views, and viewset.
    - Creating the Lead pages (Leads list & adding leads pages)
    - Making the frontend to talk with the backend to create the Lead item.

**Part 4**:
- **Adding Lead view, and Lead editing optionality**
    - Fixing the navbar a bit and adding leads bunotttons.
    - hiding and showing items if logged in or not
    - Creating lead view
    - Creating lead editing optionality


**Part 5**:
- **Adding teams**
    - Added teams, serializers, views, and view sets, with a some custom functions.
    - Fixed some login items that were needed to be fixed to work properely with the teams.

## Todo:

- Parts 6-16 => This will be done without me adding a tutorial, it takes too long.
- Add some custome design, which is not from Steins videos.
- If there wont be Docker in the tutorial, dockerize it.
