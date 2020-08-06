<template>
<div class="search">

  <UnderConstruction/>

  <h1>Search</h1>

  <form method="get" class="form-horizontal">
    <input type="text"
           class="form-control"
           id="searchInput"
           placeholder="enter an ID, username, or last name"
           required />

    <br />
    <button type="submit" class="btn btn-primary">Search People</button>
  </form>

</div>
</template>

<script>
import UnderConstruction from '@/components/UnderConstruction.vue'

export default {
    name: 'Search',
    components: {
        UnderConstruction
    }
}
</script>
