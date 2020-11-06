<template>
<div>

  <form v-on:submit.prevent
        class="form-inline">
    <div class="form-group">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <!-- <span>{{filters.teamId ? filters.teamId : "No team selected."}}</span>&nbsp; -->
      <select @change="changeTeam($event)"
              class="form-control"
              v-model="filters.teamId">
        <option value="">Choose Team</option>
        <option v-for="current in teams"
                v-bind:key="current.id"
                :value="current.id">
          {{current.name}}</option>
      </select>
    </div>

    <div v-if="filters.teamId && users"
         v-on:submit.prevent
         class="form-group">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <!-- <span>{{filters.userId ? filters.userId : "All users for team."}}</span>&nbsp; -->
      <select @change="changeUser($event)"
              class="form-control"
              v-model="filters.userId">
        <option value="">Users &#40;All&#41;</option>
        <option v-for="current in users"
                v-bind:key="current.id"
                :value="current.id">
          {{current.name}}</option>
      </select>
    </div>

    <div class="form-group">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <span>{{filters.date ? getDateUsc(filters.date) : "Today"}}</span>&nbsp;
      <input type="date"
             placeholder="'mm/dd/yyyy'"
             v-model="filters.date"
             @change="changeDate($event)"
             class="form-control"
             />
    </div>

    <div class="form-group">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <DropDownWithAnchors
        v-bind:theClass="'form-group'"
        v-bind:label="'External Resources'"
        v-bind:links="[{id:'1',value:'https://example.com/',name:'link1'}
                      ,{id:'2',value:'https://example.com/',name:'link2'}
                      ,{id:'3',value:'https://example.com/',name:'link3'}
                      ,{id:'4',value:'https://example.com/',name:'link4'}
                      ,{id:'5',value:'https://example.com/',name:'link5'}
                      ,{id:'6',value:'https://example.com/',name:'link6'}
                      ,{id:'7',value:'https://example.com/',name:'link7'}
                      ]"
        />
    </div>

    <div class="form-group" v-show="allowDevmode">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <button
        type="button"
        class="btn"
        :class="{'btn-danger':!devmode,'btn-success':devmode}"
        v-on:click="toggleDevMode()">
        <span class="glyphicon glyphicon-alert"></span>
        {{devmode ? "Disable" : "Enable"}} Dev Mode
      </button>
    </div>

    <div class="form-group">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <button
        class="btn btn-primary"
        v-on:click="refresh()">
        <span class="glyphicon glyphicon-refresh"></span>
      </button>
    </div>

  </form>

</div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex"
import DropDownWithAnchors from '@/components/DropDownWithAnchors.vue'

export default {
    name: "StateFilters",
    components: {
        DropDownWithAnchors
    },
    methods: {
        ...mapMutations([
            "updateApi",
            "updateUsers",
            "updateCurrentUser",
            "updateFilters",
            "updateRefresh",
            "toggleDevMode",
        ]),
        changeTeam(event) {
            //location.href = `./?teamId=${event.target.value}`
            this.runtimevals.filters.teamId = event.target.value
            this.getFilters(this.stateQueryString)
            this.runtimevals.users = ""
            this.getUsers()
        },
        changeUser(event) {
            //location.href = `./?userId=${event.target.value}`
            this.runtimevals.filters.userId = event.target.value
            this.getFilters(this.stateQueryString)
        },
        changeDate(event) {
            //location.href = `./?pickDay=${event.target.value}`
            this.runtimevals.filters.date = event.target.value
            this.getFilters(this.stateQueryString)
        },
        getDateUsc(val) {
            //NOTE: To ensure the locale and timezone match, can
            //alternately set the timeZone in the options to UTC.
            return (new Date(`${val}T00:00:00`))
                .toLocaleDateString(
                    "en-US"
                    , { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        },
        getData(endpoint, that, bucket, refs, errorPrompt) {
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
                that[errorPrompt] = "No configuration foo."
            }
        },
        getFilters(qstrings) {
            this.getData(this.api.filters+qstrings, this, "runtimevals", "filters", "errorPrompt")
        },
        getUsers() {
            this.getData(this.api.users, this, "runtimevals", "users", "errorPrompt")
        },
        refresh() { this.updateRefresh(new Date()) },
    },
    mounted() {

        this.updateApi((JSON.parse((document.getElementById("frontEndWiring")).textContent)).api)

        //NOTE: StateFilters will eventually handle filters client
        //side and not require a request to the server.
        this.getFilters("")//this.getData(this.api.filters, this, "runtimevals", "filters", "errorPrompt")
        this.getData(this.api.currentUser, this, "runtimevals", "currentUser", "errorPrompt")
        this.getUsers()
    },
    computed: {
        filters: function() { return this.runtimevals.filters },
        users: function() { return this.runtimevals.users },
        currentUser: function() { return this.runtimevals.currentUser },
        stateQueryString: function() { return `?teamId=${this.runtimevals.filters.teamId}&pickOwner=${this.runtimevals.filters.userId}&pickDay=${this.runtimevals.filters.date}` },
        teams: function() { return this.currentUser.teams },
        ...mapGetters([
            "api",
            "devmode",
        ]),
    },
    data() {
        return {
            allowDevmode: false,
            errorPrompt: "",
            runtimevals: {
                filters: "",
                currentUser: "",
                users: "",
            },
        }
    },
    watch: {
        filters() { this.updateFilters(this.filters) },
        users() { this.updateUsers(this.users) },
        currentUser() { this.updateCurrentUser(this.currentUser) },
    }
}
</script>

<style scoped>
</style>
