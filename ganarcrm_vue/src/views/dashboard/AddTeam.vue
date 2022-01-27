<template>
    <div class="container">
        <div class="columns">
            <div class="column is-12 is-multiline">
                <h1 class="title">
                    <strong>Add A Team</strong>
                </h1>
                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Team Name</label>
                        <div class="control">
                            <input type="text" class="input" v-model="name" />
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-success">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'
    export default {
        name: 'AddTeam',
        data() {
            return {
                name: ''
            }
        },
        methods: {
            async submitForm() {
                this.$store.commit("setIsLoading", true);

                const team = {
                    name: this.name
                }

                await axios
                    .post('api/v1/teams/', team)
                    .then(response => {
                        toast({
                            message: "Team Created!",
                            type: "is-success",
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: "bottom-right",
                        });
                        this.$store.commit('setTeam', { 'id': response.data.id, 'name': response.data.name })

                        this.$router.push('dashboard')
                    }).catch(error => {
                        console.log(error)
                    })

                this.$store.commit("setIsLoading", false);

            }
        }
    }
</script>