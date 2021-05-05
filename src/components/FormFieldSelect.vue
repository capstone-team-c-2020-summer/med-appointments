<template>
<div :class="{'form-group': true, 'has-error': error}">
  <div class="col-xs-12"></div>
  <label class="col-md-4 control-label"
         :for="id">
    {{label}}
  </label>
  <div class="col-md-8">
    <select class="form-control"
            :id="id"
            v-model="mutant">
      <option value="">Choose One</option>
      <option v-for="current in data"
              v-bind:key="current.id"
              :value="current.code || current.id || current.name">
        {{current.name}}</option>
    </select>
  </div>
  <span v-if="error"
        class="col-md-offset-4 col-md-8 help-block">
    {{error}}
  </span>
</div>
</template>


<script>
export default {
    name: "FormFieldSelect",
    props: [
        "label",
        "error",
        "id",
        "data",
        "value"
    ],
    data: function() {
        return {
            mutant: this.value
        }
    },
    computed: {
        hasMutated: function() { return this.value !== this.mutant }
    },
    watch: {
        mutant() {
            if (this.hasMutated) {
                this.$emit('update', this.mutant)
            }
        },
        value() {
            if (this.hasMutated) {
                this.mutant = this.value
            }
        }
    }
}
</script>
