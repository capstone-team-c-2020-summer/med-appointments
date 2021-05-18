<template>
  <div class="search">
    <div v-if="success">
      <h1>Search Results</h1>

      <vue-good-table
        :columns="columns"
        :rows="results"
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

      <br />
      <router-link :to="{ name: 'Intake' }" class="btn btn-danger btn-block">
        Can't find the record?
      </router-link>
      <br />
      <button type="button" class="btn btn-warning" v-on:click="searchAgain()">
        New Search
      </button>
    </div>
    <div v-else :data-lazy="success">
      <h1>Search</h1>

      <form class="form-horizontal" @submit.prevent="searchForRecords()">
        <input
          type="text"
          class="form-control"
          placeholder="enter an ID, username, or last name"
          v-model="searchInput"
          required
        />

        <br />
        <button type="submit" class="btn btn-primary">
          Search People
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";

export default {
  name: "Search",
  props: [],
  components: {
    VueGoodTable
  },
  computed: {
    searchRecords: function() {
      return this.api ? this.api.searchRecords : "";
    },
    ...mapGetters(["api"])
  },
  data() {
    return {
      columns: [
        {
          label: "Record",
          field: "record"
        },
        {
          label: "Name",
          field: "name"
        },
        {
          label: "Email",
          field: "email"
        },
        {
          label: "Phone",
          field: "phone"
        }
      ],
      searchInput: "",
      success: false,
      results: ""
    };
  },
  methods: {
    searchAgain() {
      this.success = false;
      this.results = "";
    },
    searchForRecords() {
      const endpoint = this.searchRecords;

      // TODO: Move the results into the state so navigation can
      // revisit previous results.
      if (endpoint) {
        fetch(`${endpoint}?foo=${this.searchInput}`)
          .then(response => response.json())
          .then(json => {
            if (json) {
              this.results = json;
              this.success = true;
            } else {
              this.errorPrompt = "Response failed.";
              this.success = false;
            }
          })
          .catch(error => {
            this.errorPrompt = `Request failed. ${error}`;
            this.success = false;
          });
      } else {
        this.errorPrompt = "No configuration for Users.";
        this.success = false;
      }
    }
  }
};
</script>

<!-- <style scoped></style> -->
