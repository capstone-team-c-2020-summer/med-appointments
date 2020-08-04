<template>
<div v-if="hasData">
  <h1>Appointments {{title}}</h1>
  <div v-if="!detail">
    <div aria-label="Table Widgets, Section 1"
         class="mfsw-row">
      <div class="column left">
        <label>Show
          <select aria-controls="queueRange"
                  v-model="limit">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          entries
        </label>
      </div>

      <div class="column right">
        <label>Filter Results&#58;
          <input type="search"
                 aria-controls="queueRange"
                 v-model="search">
        </label>

        <span>&nbsp;</span>
        <button type="button"
                class="btn"
                :class="{'btn-success':filterAnd,'btn-default':!filterAnd}"
                v-on:click="toggleFilterAnd()">
          {{filterAnd ? 'Requiring All' : 'Matching Any'}}
        </button>

        <div v-if="allowRefresh">
          <span>&nbsp;</span>
          <button
            class="btn btn-primary"
            v-on:click="getAppointments">
            <span class="glyphicon glyphicon-refresh"></span>
          </button>
        </div>

      </div>
    </div>

    <table aria-label="Table"
           class="table">
      <thead><tr><th>Time</th><th>Student</th><th>Here to see</th><th>On Team</th><th>Meeting with</th><th>Subject</th><th>Status</th></tr></thead>
      <tbody v-for="(entry, index) in output" v-bind:key="index">
        <tr>
          <td>
            <button type="button"
                    class="btn btn-default"
                    v-on:click="detail = entry">
              <span class="glyphicon glyphicon-search"></span>
            </button>
            {{ entry.time }}
          </td>
          <td v-if="entry.contactId">
            <router-link :to="{ name: 'Record', params: { id: entry.contactId }}">{{ entry.name }}</router-link>
          </td>
          <td v-else>{{ entry.name }}</td>
          <td>{{ entry.ownerName }}</td>
          <td>{{ entry.teamName }}</td>
          <td>{{ entry.interactionOwnerName }}</td>
          <td>
            <router-link v-if="entry.interactionId"
                         class="btn btn-primary"
                         :to="{ name: 'Appointment', params: { id: entry.interactionId }}">
              <span class="glyphicon glyphicon-link"></span>
            </router-link>
            {{ entry.subject }}
          </td>
          <td v-if="hasPermission(entry.teamId)">
            <span v-show="false">{{entry.condition}},{{entry.id}}</span>
            <DropDownWithActions
              v-bind:condition="entry.condition"
              v-bind:id="entry.id"
              v-bind:endpoint="api.updateCondition"
              v-bind:actions="[{id:'1',value:'reset',name:'Reset',result:'Scheduled'}
                              ,{id:'2',value:'checkin',name:'Check-in',result:'Checked In'}
                              ,{id:'3',value:'begin',name:'Begin',result:'Active'}
                              ,{id:'4',value:'finish',name:'Finish',result:'Finished'}
                              ,{id:'5',value:'cancel',name:'Cancel',result:'Canceled'}
                              ,{id:'6',value:'noshow',name:'Noshow',result:'No-show'}]"
              @update="val => entry.condition = val"
              />
          </td>
          <td v-else>{{entry.condition}}</td>
        </tr>
      </tbody>
    </table>

    <div aria-label="Table Widgets, Section 2"
         class="mfsw-row">
      <div class="column left">
        Showing {{entryBeg}} to {{entryEnd}} of {{entryNum}} entries
      </div>
      <div class="column right">
        <button type="button"
                class="btn btn-primary"
                v-on:click="prevPage()">Prev</button>&nbsp;
        <button type="button"
                class="btn btn-primary"
                v-on:click="nextPage()">Next</button>
        <span>&nbsp;Page {{currentFiltered}}/{{sizeFiltered}}&nbsp;</span>
      </div>
    </div>

  </div>

  <br>
  <br>
  <br>
</div>

<div v-else>
  <h1>No data for {{title}}</h1>
  <div class="alert alert-info">
    <!-- <p>{{loading ? "Loading..." :"No data to display."}}</p> -->
    <p>{{loadingPrompt}}</p>
  </div>
  <button
    v-if="allowRefresh"
    class="btn btn-warning btn-block"
    v-on:click="getAppointments">
    <span class="glyphicon glyphicon-refresh"></span>
    <span>&nbsp;Refresh</span>
  </button>
</div>
</template>

<script>
import DropDownWithActions from '@/components/DropDownWithActions.vue'

export default {
    name: "TableAppointments",
    props: [
        "allowRefresh",
        "api",
        "appts",
        "currentUserId",
        "devmode",
        "filters",
        "loading",
        "searchState",
        "teamsForUser",
        "title",
        "users",
    ],
    components: {
        DropDownWithActions,
    },
    computed: {
        subSearch() { return this.search.split(" ", this.subStringMax).filter(foo => foo) },
        subFilter() { return this.filters.split(" ", this.subStringMax).filter(foo => foo) },
        currentId: function() { return this.detail.id },
        hasDataLogic: function() { return (x) => (y) => (z) => x && x.length > 0 && y && z },
        hasData: function() { return this.hasDataLogic(this.appts)(this.api)(this.currentUserId) },
        numFiltered: function() { return this.getRange.length },
        sizeFiltered: function() {
            return Math.floor(this.numFiltered / this.limit) + (((this.numFiltered % this.limit) > 0) ? 1 : 0)
        },
        currentFiltered: function() { return this.offset + 1 },
        output: function() { return this.getRange.slice(this.entryOff, this.entryEnd) },
        getRangeSubFilter: function() {
            return (x) => (y) =>
                !x
                || x.length < 1
                || x.some(elem => y.condition.toLowerCase().indexOf(elem.toLowerCase()) > -1)
        },
        getRangeSubSearchAnd: function() {
            return (x) => (y) =>
                !x
                || x.length < 1
                || x.every(elem => Object.values(y).some(val => val.toLowerCase().indexOf(elem.toLowerCase()) > -1))
        },
        getRangeSubSearchIor: function() {
            return (x) => (y) =>
                !x
                || x.length < 1
                || x.some(elem => Object.values(y).some(val => val.toLowerCase().indexOf(elem.toLowerCase()) > -1))
        },
        getRange: function() {
            return (this.appts && this.appts[0]
                    ? this.filterAnd
                    ? this.appts
                    .filter(item => this.getRangeSubFilter(this.subFilter)(item))
                    .filter(item => this.getRangeSubSearchAnd(this.subSearch)(item))
                    : this.appts
                    .filter(item => this.getRangeSubFilter(this.subFilter)(item))
                    .filter(item => this.getRangeSubSearchIor(this.subSearch)(item))
                    : this.appts)
        },
        entryNum() { return this.getRange.length },
        entryPos() {
            return this.offset < 0 ? 0
                : this.offset > (this.entryNum / this.limit) ? Math.floor(this.entryNum / this.limit)
                : this.offset
        },
        entryOff() { return this.entryPos * this.limit },
        entryBeg() { return this.entryOff + 1 },
        entryMod() { return (this.entryNum - this.entryOff) % this.limit },
        entryEnd() {
            return (((this.entryNum - this.entryOff) < this.limit)
                    ? this.entryMod
                    : this.limit) * 1 + this.entryOff
        },
    },
    data() {
        return {
            detail: "",
            filterAnd: true,
            loadingPrompt: "",
            limit: 25,
            mode: "table",
            offset: 0,
            search: "",
        }
    },
    methods: {
        toggleFilterAnd() { this.filterAnd = !this.filterAnd },
        hasPermission(teamId) { return this.teamsForUser.map(id => id * 1).includes((teamId * 1)) },
        getAppointments() { this.$emit("refresh") },
        prevPage: function()
        {
            if (this.offset > 0) {
                --this.offset;
            }
        },
        nextPage: function()
        {
            if (this.currentFiltered < this.sizeFiltered) {
                ++this.offset;
            }
        },
        updateLoadingPrompt: function() {
            this.loadingPrompt = "Loading..."
            if (!this.loading) {
                setTimeout(() => {
                    this.loadingPrompt = "No data to display."
                }, 2000)
            }
        },
    },
    mounted() {
        this.updateLoadingPrompt()
        this.search = this.searchState
    },
    watch: {
        search() { this.offset = 0; this.$emit("updateSearchState", this.search) },
        detail() { this.$emit("updateDetail", this.detail) },
        loading() { this.updateLoadingPrompt() },
    },
}
</script>

<style scoped>

/*NOTE: Copied from Quickview.vue*/

.mfsw-row .column {
    float: left;
    padding: 0 10px;
    min-width: 120px;
}
.mfsw-row .left {
    width: 30%;
}
.mfsw-row .right {
    width: 70%;
    text-align: right;
}
.mfsw-row:after {
    content: "";
    display: block;
    clear: both;
}
</style>
