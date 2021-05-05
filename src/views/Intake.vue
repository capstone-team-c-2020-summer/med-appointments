<template>
<div class="search">
  
  <UnderConstruction/>

  <h1>Intake Form</h1>

  <form class="form-horizontal"
        @submit.prevent="submitIntakeForm()">


    <!-- TODO: Change these to readonly values from the statefilter. -->
    <FormFieldSelect v-bind:label="'Team'"
                     v-bind:error="errors.team"
                     v-bind:id="'team'"
                     v-bind:data="currentUser.teams"
                     v-bind:value="intake.team"
                     @update="val => intake.team = val"
                     />


    <FormFieldSelect v-bind:label="'Assign to'"
                     v-bind:error="errors.user"
                     v-bind:id="'user'"
                     v-bind:data="runtimevals.users"
                     v-bind:value="intake.user"
                     @update="val => intake.user = val"
                     />


    <FormFieldInput v-bind:label="'Subject'"
                    v-bind:error="errors.subject"
                    v-bind:id="'subject'"
                    v-bind:type="'text'"
                    v-bind:value="intake.subject"
                    @update="val => intake.subject = val"
                    />


    <FormFieldInput v-bind:label="'Given/First Name'"
                    v-bind:error="errors.first_name"
                    v-bind:id="'first_name'"
                    v-bind:type="'text'"
                    v-bind:value="intake.first_name"
                    @update="val => intake.first_name = val"
                    />


    <FormFieldInput v-bind:label="'Surname/Last Name'"
                    v-bind:error="errors.last_name"
                    v-bind:id="'last_name'"
                    v-bind:type="'text'"
                    v-bind:value="intake.last_name"
                    @update="val => intake.last_name = val"
                    />


    <FormFieldInput v-bind:label="'Email'"
                    v-bind:error="errors.email"
                    v-bind:id="'email'"
                    v-bind:type="'text'"
                    v-bind:value="intake.email"
                    @update="val => intake.email = val"
                    />


    <FormFieldInput v-bind:label="'Telephone'"
                    v-bind:error="errors.telephone"
                    v-bind:id="'telephone'"
                    v-bind:type="'text'"
                    v-bind:value="intake.telephone"
                    @update="val => intake.telephone = val"
                    />


    <FormFieldInput v-bind:label="'Appointment Date'"
                    v-bind:error="errors.startOnDate"
                    v-bind:id="'startOnDate'"
                    v-bind:type="'date'"
                    v-bind:value="intake.startOnDate"
                    @update="val => intake.startOnDate = val"
                    />


    <FormFieldInput v-bind:label="'Start Time (Hour:Minute AM/PM)'"
                    v-bind:error="errors.startOnTime"
                    v-bind:id="'startOnTime'"
                    v-bind:type="'time'"
                    v-bind:value="intake.startOnTime"
                    @update="val => intake.startOnTime = val"
                    />


    <FormFieldInput v-bind:label="'Duration'"
                    v-bind:error="errors.startOnDuration"
                    v-bind:id="'startOnDuration'"
                    v-bind:type="'number'"
                    v-bind:value="intake.startOnDuration"
                    @update="val => intake.startOnDuration = val"
                    />


    <br />
    <button type="submit"
            class="btn btn-primary"
            >
      Submit Intake Form
    </button>
  </form>

</div>
</template>


<script>
import { mapGetters } from "vuex"
import FormFieldInput from '@/components/FormFieldInput.vue'
import FormFieldSelect from '@/components/FormFieldSelect.vue'
import UnderConstruction from '@/components/UnderConstruction.vue'


export default {
    name: 'Intake',
    components: {
        UnderConstruction,
        FormFieldInput,
        FormFieldSelect,
    },
    computed: {
        ...mapGetters([
            "api",
            "currentUser",
        ]),
    },
    data: function() {
        return {
            intake: "",
            errors: "",
            runtimevals: {
                users: '',
            },
        }
    },
    methods: {
        submitIntakeForm() {
            console.log("TODO")
        },
        resetForm: function(that, ref) {
            that[ref] = {
                team: '',
                subject: '',
                first_name: '',
                last_name: '',
                email: '',
                telephone: '',
                startOnDate: '',
                startOnTime: '',
                startOnDuration: '30',
                user: '',
            }
        },
    },
    mounted() {
        function getData(endpoint, that, bucket, refs, errorPrompt) {
            if (endpoint) {
                fetch(endpoint)
                    .then(response => response.json())
                    .then(json => {
                        if (json) {
                            that[bucket][refs] = json
                        } else {
                            that[errorPrompt] = "Response failed."
                        }
                    })
                    .catch(error => {
                        that[errorPrompt] = `Request failed. ${error}`
                    })
            } else {
                that[errorPrompt] = "No configuration."
            }
        }

        getData(this.api.apptUsers, this, "runtimevals", "users", "errorPrompt")

        this.resetForm(this, "intake")
    },
}
</script>
