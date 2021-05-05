<template>
<div class="search">

  <UnderConstruction/>

  <div v-if="success">
    <h1>Search Results</h1>
    <button type="button"
            class="btn btn-primary"
            v-on:click="searchAgain()">New Search
    </button>
    <table aria-label="Table"
           class="table">
      <tr v-for="(entry, index) in results" :key="index">
	<td v-if="entry.recordId">
          <router-link :to="{ name: 'Record', params: { id: entry.recordId }}">{{ entry.id }}</router-link>
        </td>
        <td v-else>{{ entry.id }}</td>
        <td>{{ entry.name }}</td>
        <td>{{ entry.email }}</td>
        <td>{{ entry.phone }}</td>
      </tr>
    </table>
  </div>
  <div v-else
       :data-lazy="success">
    <h1>Search</h1>

    <form class="form-horizontal"
           @submit.prevent="searchForRecords()"
          >
    <input type="text"
           class="form-control"
           placeholder="enter an ID, username, or last name"
           v-bind:value="searchInput"
           @update="val => searchInput = val"
           required />

    <br />
    <button type="submit"
            class="btn btn-primary"
            >
      Search People
    </button>
  </form>
  </div>

</div>
</template>

<script>
import { mapGetters } from "vuex"
import UnderConstruction from '@/components/UnderConstruction.vue'

export default {
    name: 'Search',
    props: [
    ],
    components: {
        UnderConstruction
    },
    computed: {
        searchRecords: function() { return this.api ? this.api.searchRecords : "" },
        ...mapGetters([
            "api",
        ]),
    },
    data() {
        return {
            searchInput: '',
            success: false,
            results: '',
        }
    },
    methods: {
        searchAgain() {
            this.success = false
            this.results = ''
        },
        searchForRecords() {
            const endpoint = this.searchRecords
            if (endpoint) {
                fetch(`${endpoint}?foo=${this.searchInput}`)
                    .then(response => response.json())
                    .then(json => {
                        if (json) {
                            this.results = json
                            this.success = true
                        } else {
                            this.errorPrompt = "Response failed."
                            this.success = false
                        }
                    })
                    .catch(error => {
                        this.errorPrompt = `Request failed. ${error}`
                        this.success = false
                    })
            } else {
                this.errorPrompt = "No configuration for Users."
                this.success = false
            }
        }
    }
}
</script>
