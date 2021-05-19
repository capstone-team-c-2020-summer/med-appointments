<template>
  <div v-if="!record || !record.contact">Loading...</div>
  <div v-else class="record">
    <UnderConstruction />

    <div>
      <div v-if="photo">
        <span
          class="glyphicon glyphicon-user"
          aria-hidden="true"
          style="font-size: 150px;"
        ></span>
      </div>
      <div v-else>
        <span
          class="glyphicon glyphicon-user"
          aria-hidden="true"
          style="font-size: 150px;"
        ></span>
        <p>No photo on file.</p>
      </div>
      <div>
        <h1>
          <span
            >Record for&#58; {{ record.contact.fullName }} ({{
              record.contact.badgeId
            }})</span
          >
        </h1>
        <p>{{ record.contact.email }}</p>
      </div>
    </div>

    <ul class="nav nav-tabs">
      <li id="tab_mode_record_details">
        <a @click="updateMode(modeDetails)">Details</a>
      </li>
      <li id="tab_mode_record_history">
        <a @click="updateMode(modeHistory)">History</a>
      </li>
      <li id="tab_mode_record_files">
        <a @click="updateMode(modeFiles)">Files</a>
      </li>
      <li v-show="numTeams > 0" id="tab_mode_record_create_appointment">
        <a @click="updateMode(modeCreateAppointment)">Create Appointment</a>
      </li>
    </ul>

    <div v-if="mode === modeDetails">
      <p>Full Name: {{ record.contact.fullName }}</p>
      <p>First/Given: {{ record.contact.firstName }}</p>
      <p>Middle: {{ record.contact.middleName }}</p>
      <p>Last/Family/Surname: {{ record.contact.lastName }}</p>
      <p>Badge ID: {{ record.contact.badgeId }}</p>
      <p>Email: {{ record.contact.email }}</p>
      <p>ID: {{ record.contact.id }}</p>
      <p>username: {{ record.contact.username }}</p>
      <p>Phone: {{ record.contact.phone }}</p>
      <p>Veteran: {{ record.contact.veteran }}</p>
      <p>Residency: {{ record.contact.residency }}</p>
      <p>Gender: {{ record.contact.gender }}</p>
    </div>

    <div v-else-if="mode === modeHistory">
      <vue-good-table
        :columns="columns"
        :rows="record.history"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 25,
          position: 'bottom',
          perPageDropdown: [5, 10, 25, 50],
          dropdownAllowAll: false,
          setCurrentPage: 1,
          nextLabel: 'next',
          prevLabel: 'prev',
          rowsPerPageLabel: 'Rows per page',
          ofLabel: 'of',
          pageLabel: 'page',
          allLabel: 'All'
        }"
        :search-options="{ enabled: true }"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'record' && props.row.recordId">
            <router-link
              :to="{ name: 'Record', params: { id: props.row.recordId } }"
              >{{ props.row.id }}</router-link
            >
          </span>
        </template>
      </vue-good-table>
    </div>

    <div v-else-if="mode === modeFiles">
      {{ mode }}
    </div>

    <div v-else-if="mode === modeCreateAppointment">
      {{ mode }}
    </div>

    <div v-else>Unknown mode: {{ mode }}</div>
  </div>
</template>

<script>
import UnderConstruction from "@/components/UnderConstruction.vue";
import { mapMutations, mapGetters } from "vuex";
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";

export default {
  name: "Record",
  components: {
    UnderConstruction,
    VueGoodTable
  },
  computed: {
    ...mapGetters(["api"]),
    record: function() {
      return this.runtimevals.record;
    },
    modesAvailable: function() {
      return [
        this.modeDetails,
        this.modeHistory,
        this.modeFiles,
        this.modeCreateAppointment
      ];
    },
    modeDetails: function() {
      return "mode_record_details";
    },
    modeHistory: function() {
      return "mode_record_history";
    },
    modeFiles: function() {
      return "mode_record_files";
    },
    modeCreateAppointment: function() {
      return "mode_record_create_appointment";
    }
  },
  data() {
    return {
      columns: [
        {
          label: "Date",
          field: "createdOnOrStartOn"
        },
        {
          label: "Subject",
          field: "interactionSubject"
        },
        {
          label: "AssignedTo",
          field: "interactionAssignedToName"
        },
        {
          label: "Via",
          field: "interactionMedium"
        }
      ],
      mode: "mode_record_details",
      photo: false,
      numTeams: 1,
      loading: false,
      runtimevals: {
        record: ""
      },
      errorPrompt: ""
    };
  },
  methods: {
    ...mapMutations(["updateErrorPrompt"]),
    updateMode: function(mode) {
      this.mode = mode;
    },
    setModeToDetails: function() {
      console.log("hit mode button details");
    },
    setModeToHistory: function() {
      console.log("hit mode button history");
    },
    setModeToFiles: function() {
      console.log("hit mode button files");
    },
    setModeToCreateAppointment: function() {
      console.log("hit mode button create appointment");
    },
    getRecord: function() {
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

      console.log(this.api.record);
      getData(this.api.record, this, "runtimevals", "record", "errorPrompt");
    }
  },
  mounted() {
    this.getRecord();
  }
};
</script>

<!-- <style></style> -->
