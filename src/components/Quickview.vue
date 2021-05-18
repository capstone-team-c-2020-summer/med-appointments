<template>
  <div class="overlay">
    <div class="summary">
      <h1>Appointment/Interaction Summary</h1>
      <button
        type="button"
        class="btn btn-danger btn-block"
        v-on:click="closeSummary()"
      >
        <span class="glyphicon glyphicon-remove"></span>
        Done
      </button>
      <hr />

      <div class="mfsw-row">
        <div class="column">
          <p v-if="detail.contactId">
            <router-link
              :to="{ name: 'Record', params: { id: detail.contactId } }"
            >
              {{ detail.contactName }}
            </router-link>
          </p>
          <p v-else>{{ detail.name }}</p>
        </div>
      </div>

      <div class="mfsw-row">
        <div class="column left">
          <strong>Team</strong>
        </div>
        <div class="column right">
          <span>{{ detail.teamName }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Appointment</strong>
        </div>
        <div class="column right">
          <span>{{ detail.id }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Interaction</strong>
        </div>
        <div class="column right">
          <span>{{ detail.interactionId }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Here for</strong>
        </div>
        <div class="column right">
          <span>{{ detail.apptType }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Signed in at</strong>
        </div>
        <div class="column right">
          <span>{{ detail.interactionCreatedOn }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Here to see</strong>
        </div>
        <div class="column right">
          <span>{{ detail.ownerName }}</span
          >&nbsp;
          <button
            v-if="hasPermission"
            type="button"
            class="btn btn-default"
            v-on:click="reassigning = !reassigning"
          >
            <span class="glyphicon glyphicon-edit"></span>
          </button>
          <form v-show="reassigning" v-on:submit.prevent>
            <select class="form-control" v-model="reassignOwnerId">
              <option value="">Choose One</option>
              <option
                v-for="current in users"
                v-bind:key="current.id"
                :value="current.id"
              >
                {{ current.name }}</option
              >
            </select>
            <button
              v-show="reassignOwnerId"
              type="button"
              class="btn btn-warning"
              v-on:click="reassignAppointment()"
              :disabled="loadingReassign"
            >
              <span :class="reassignClass"></span>
              Reassign Appointment
            </button>
          </form>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Meeting with</strong>
        </div>
        <div class="column right">
          <span>{{ detail.interactionOwnerName }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Major asserted</strong>
        </div>
        <div class="column right">
          <span>{{ detail.major }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Preprof asserted</strong>
        </div>
        <div class="column right">
          <span>{{ detail.preprof }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Honors asserted</strong>
        </div>
        <div class="column right">
          <span>{{ detail.honors }}</span>
        </div>
      </div>

      <div class="mfsw-row">
        <div class="column left">
          <strong>Expected grad</strong>
        </div>
        <div class="column right">
          <span>{{ detail.gradExpected }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>State</strong>
        </div>
        <div class="column right">
          <span>{{ detail.condition }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Subject</strong>
        </div>
        <div class="column right">
          <span>{{ detail.subject }}</span
          >&nbsp;
          <router-link
            v-show="detail.interactionId"
            class="btn btn-primary"
            :to="{ name: 'Appointment', params: { id: detail.interactionId } }"
          >
            <span class="glyphicon glyphicon-link"></span>
          </router-link>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Name</strong>
        </div>
        <div class="column right">
          <span>{{ detail.name }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Reasons</strong>
        </div>
        <div class="column right">
          <span>{{ detail.reasons }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Notes</strong>
        </div>
        <div class="column right">
          <span>{{ detail.notes }}</span>
        </div>
      </div>
      <div class="mfsw-row">
        <div class="column left">
          <strong>Appointment Start</strong>
        </div>
        <div class="column right">
          <span>{{ detail.startOn }}</span>
        </div>
      </div>

      <hr />
      <button
        v-if="hasPermission"
        type="button"
        class="btn btn-success btn-block"
        v-on:click="takeBegin()"
        :disabled="loadingTakeBegin"
      >
        <span :class="takeBeginClass"></span>
        <span>Begin Session</span>
      </button>
    </div>

    <div v-show="devmode">
      <pre v-if="blob">{{ blob }}</pre>
      <pre v-if="errorPrompt">{{ errorPrompt }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  name: "Quickview",
  props: [
    "apptUsers",
    "currentUserId",
    "detail",
    "devmode",
    "hasPermission",
    "reassign",
    "takebegin"
  ],
  data() {
    return {
      loadingReassign: false,
      loadingTakeBegin: false,
      reassigning: false,
      reassignOwnerId: "",
      blob: "",
      errorPrompt: "",
      users: ""
    };
  },
  computed: {
    reassignClass: function() {
      return this.loadingReassign
        ? "glyphicon glyphicon-transfer"
        : "glyphicon glyphicon-check";
    },
    takeBeginClass: function() {
      return this.loadingTakeBegin
        ? "glyphicon glyphicon-transfer"
        : "glyphicon glyphicon-forward";
    }
  },
  methods: {
    closeSummary() {
      this.reassigning = false;
      this.reassignOwnerId = "";
      this.$emit("closeSummary");
    },
    getUsers(teamId) {
      const endpoint = this.apptUsers;
      if (endpoint) {
        fetch(`${endpoint}?apptUsersTeamId=${teamId}`)
          .then(response => response.json())
          .then(json => {
            if (json) {
              this.users = json;
            } else {
              this.errorPrompt = "Response failed.";
            }
          })
          .catch(error => {
            this.errorPrompt = `Request failed. ${error}`;
          });
      } else {
        this.errorPrompt = "No configuration for Users.";
      }
    },
    reassignAppointment() {
      const endpoint = this.reassign;
      const payload = { id: this.detail.id, ownerId: this.reassignOwnerId };
      this.loadingReassign = true;

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(json => {
            if (json && json.status === "success") {
              this.blob = json;
              this.$emit("refresh");
              setTimeout(
                function() {
                  this.loadingReassign = false;
                }.bind(this),
                1000
              );
            } else {
              this.errorPrompt = "Response failed.";
              this.loadingReassign = false;
            }
          })
          .catch(error => {
            this.errorPrompt = `Request failed. ${error}`;
            this.loadingReassign = false;
          });
      } else {
        this.errorPrompt = "No configuration.";
        this.loadingReassign = false;
      }
    },
    takeBegin() {
      const endpoint = this.takebegin;
      const payload = { id: this.detail.id, ownerId: this.currentUserId };
      this.loadingTakeBegin = true;

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(json => {
            if (
              json &&
              json.status === "success" &&
              json.appointment.interactionId
            ) {
              this.blob = json;
              setTimeout(
                function() {
                  this.$router.push({
                    name: "Appointment",
                    params: { id: json.appointment.interactionId }
                  });
                  this.loadingTakeBegin = false;
                }.bind(this),
                1000
              );
            } else {
              this.errorPrompt = "Response failed.";
              this.loadingTakeBegin = false;
            }
          })
          .catch(error => {
            this.errorPrompt = `Request failed. ${error}`;
            this.loadingTakeBegin = false;
          });
      } else {
        this.errorPrompt = "No configuration.";
        this.loadingTakeBegin = false;
      }
    }
  },
  mounted() {
    this.getUsers(this.detail.teamId);
  }
};
</script>

<style scoped>
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
}
.mfsw-row:after {
  content: "";
  display: block;
  clear: both;
}
</style>
