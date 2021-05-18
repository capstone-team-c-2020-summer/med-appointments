<template>
  <div :class="{ 'form-group': true, 'has-error': error }">
    <label class="col-md-4 control-label" :for="id">
      {{ label }}
    </label>
    <div class="col-md-8">
      <input
        class="form-control"
        :type="type"
        :id="id"
        :placeholder="placeholder"
        v-model="mutant"
      />
    </div>
    <span v-if="error" class="col-md-offset-4 col-md-8 help-block">
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: "FormFieldInput",
  props: ["label", "error", "id", "type", "placeholder", "value"],
  data: function() {
    return {
      mutant: this.value
    };
  },
  computed: {
    hasMutated: function() {
      return this.value !== this.mutant;
    }
  },
  watch: {
    mutant() {
      if (this.hasMutated) {
        this.$emit("update", this.mutant);
      }
    },
    value() {
      if (this.hasMutated) {
        this.mutant = this.value;
      }
    }
  }
};
</script>
