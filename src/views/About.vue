<template>
  <div class="about">
    <h1>This is an about page</h1>
    <UnderConstruction/>
    <p>Give credits about the project here.</p>
  </div>
</template>

<script>
import UnderConstruction from '@/components/UnderConstruction.vue'

export default {
  name: 'About',
  components: {
    UnderConstruction
  }
}
</script>
