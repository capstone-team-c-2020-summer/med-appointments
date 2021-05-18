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
        <a data-for-component="mode_record_details">Details</a>
      </li>
      <li id="tab_mode_record_history">
        <a data-for-component="mode_record_history">History</a>
      </li>
      <li id="tab_mode_record_files">
        <a data-for-component="mode_record_files">Files</a>
      </li>
      <li v-show="numTeams > 0" id="tab_mode_record_create_appointment">
        <a data-for-component="mode_record_create_appointment"
          >Create Appointment</a
        >
      </li>
    </ul>

    <div v-if="mode === 'mode_record_details'">
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

    <div v-else-if="mode === 'mode_record_history'">
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

    <div v-else-if="mode === 'mode_record_files'">
      {{ mode }}
    </div>

    <div v-else-if="mode === 'mode_record_create_appointment'">
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
