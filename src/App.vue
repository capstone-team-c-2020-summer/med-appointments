<template>
<div>
  <NavBar />
  <AlertBlock :errorPrompt="errorPrompt" />
  <StateFilters />
  <router-view />
  <pre v-if="devmode">{{sdState}}</pre>
</div>
</template>

<script>
import { mapGetters } from "vuex"
import NavBar from '@/components/NavBar.vue'
import AlertBlock from '@/components/AlertBlock.vue'
import StateFilters from '@/components/StateFilters.vue'

export default {
    name: "App",
    components: {
        AlertBlock,
        NavBar,
        StateFilters,
    },
    computed: {
        browserPasses: function() { return 'fetch' in window },
        ...mapGetters([
            "sdState",
            "devmode",
            "errorPrompt"
        ]),
    },
}
</script>

<style scoped>
</style>
