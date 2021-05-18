<template>
  <div v-if="!browserPasses || errorPrompt" class="alert alert-danger">
    <strong>Warning</strong>
    <p v-if="!browserPasses">
      This browser does not work here. You might need to try a modern browser.
    </p>
    <p v-if="errorPrompt">{{ errorPrompt }}</p>
  </div>
</template>

<script>
//TODO: This can keep track of the state to prompt the user of
//      whatever. Also need to put errorPrompt from Appointments.vue
//      into the store.js and then reference here.

export default {
  name: "AlertBlock",
  props: ["errorPrompt"],
  computed: {
    browserPasses: function() {
      return "fetch" in window;
    }
  }
};
</script>

<style scoped></style>
