<template>
  <div>
    <div v-if="!detail">
      <TableAppointments
        :allowRefresh="false"
        :api="api"
        :appts="appointments"
        :currentUserId="currentUserId"
        :devmode="devmode"
        :filters="'scheduled checked'"
        :loading="loading"
        :searchState="searchStateQueued"
        :teamsForUser="teamsForUser"
        :title="'Queue'"
        :users="users"
        @updateDetail="val => updateDetail(val)"
        @updateSearchState="val => updateSearchStateQueued(val)"
        @refresh="getAppointments()"
      />
      <TableAppointments
        :allowRefresh="false"
        :api="api"
        :appts="appointments"
        :currentUserId="currentUserId"
        :devmode="devmode"
        :filters="'active'"
        :loading="loading"
        :searchState="searchStateActive"
        :teamsForUser="teamsForUser"
        :title="'In Progress'"
        :users="users"
        @updateDetail="val => updateDetail(val)"
        @updateSearchState="val => updateSearchStateActive(val)"
        @refresh="getAppointments()"
      />
      <TableAppointments
        :allowRefresh="false"
        :api="api"
        :appts="appointments"
        :currentUserId="currentUserId"
        :devmode="devmode"
        :filters="'cancel finished no-show'"
        :loading="loading"
        :searchState="searchStateFinished"
        :teamsForUser="teamsForUser"
        :title="'Completed'"
        :users="users"
        @updateDetail="val => updateDetail(val)"
        @updateSearchState="val => updateSearchStateFinished(val)"
        @refresh="getAppointments()"
      />
    </div>

    <div v-if="detail">
      <Quickview
        v-bind:currentUserId="currentUserId"
        v-bind:detail="detail"
        v-bind:hasPermission="hasPermission(detail.teamId)"
        v-bind:devmode="devmode"
        v-bind:reassign="api.reassign"
        v-bind:takebegin="api.takebegin"
        v-bind:apptUsers="api.apptUsers"
        @closeSummary="closeSummary()"
        @refresh="getAppointments()"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import TableAppointments from "@/components/TableAppointments.vue";
import Quickview from "@/components/Quickview.vue";

export default {
  name: "appointments",
  components: {
    TableAppointments,
    Quickview
  },
  computed: {
    teamsForUser: function() {
      return this.currentUser
        ? this.currentUser.teams.map(team => team.id)
        : [];
    },
    appointments: function() {
      return this.runtimevals.appointments;
    },
    currentUserId: function() {
      return this.currentUser ? this.currentUser.id : "";
    },
    ...mapGetters([
      "api",
      "currentUser",
      "devmode",
      "refresh",
      "searchStateQueued",
      "searchStateActive",
      "searchStateFinished",
      "users"
    ])
  },
  methods: {
    ...mapMutations([
      "updateErrorPrompt",
      "updateSearchStateQueued",
      "updateSearchStateActive",
      "updateSearchStateFinished"
    ]),
    hasPermission(teamId) {
      return this.teamsForUser.map(id => id * 1).includes(teamId * 1);
    },
    updateDetail(val) {
      this.detail = val;
    },
    closeSummary() {
      this.detail = "";
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.getAppointments();
      }, 60000);
    },
    getAppointments: function() {
      function getData(endpoint, that, bucket, refs, errorPrompt) {
        that["loading"] = true;
        if (endpoint) {
          fetch(endpoint)
            .then(response => response.json())
            .then(json => {
              if (json) {
                that[bucket][refs] = json;
                that["loading"] = false;
              } else {
                that[errorPrompt] = "Response failed.";
                that["loading"] = false;
              }
            })
            .catch(error => {
              that[errorPrompt] = `Request failed. ${error}`;
              that["loading"] = false;
            });
        } else {
          that[errorPrompt] = "No configuration.";
          that["loading"] = false;
        }
      }

      getData(
        this.api.appointments,
        this,
        "runtimevals",
        "appointments",
        "errorPrompt"
      );
    }
  },
  mounted() {
    this.getAppointments();
    this.startTimer();
  },
  data() {
    return {
      detail: "",
      // searchStateQueued: "",
      // searchStateActive: "",
      // searchStateFinished: "",
      errorPrompt: "",
      loading: false,
      runtimevals: {
        appointments: ""
      },
      timer: ""
    };
  },
  watch: {
    errorPrompt() {
      this.updateErrorPrompt(this.errorPrompt);
    },
    refresh() {
      this.getAppointments();
    }
  }
};
</script>

<style scoped></style>
