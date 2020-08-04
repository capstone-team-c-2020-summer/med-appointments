<template>
<div :class="theClass">
  <button v-on:click="toggle()"
          v-on:blur="debounce()"
          class="btn btn-default"
          >
    {{label}}
    <span class="caret"></span>
  </button>
  <div v-on:focus="hold()">
    <ul v-show="showing"
        class="ddown"
        v-on:focus="hold()"
        >
      <li v-for="current in links"
          v-on:focus="hold()"
          v-bind:key="current.id"
          >
        <a v-if="current.value"
           :href="current.value"
           target="_blank"
           rel="noopener"
           v-on:focus="hold()"
           v-on:blur="debounce()"
           >
          {{current.name}}
        </a>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
    name: "DropDownWithAnchors",
    props: [
        "label",
        "links",
        "theClass"
    ],
    data() {
        return {
            holding: false,
            showing: false,
            timer: "",
        }
    },
    methods: {
        hold: function() {
            clearTimeout(this.timer)
            this.holding = true
        },
        debounce: function() {
            this.holding = false
            clearTimeout(this.timer)
            this.timer = setTimeout(function() {
                this.showing = this.holding
            }.bind(this), 100);
        },
        toggle: function() { this.showing = !this.showing },
    },
}
</script>

<style scoped>
ul.ddown {
    position: absolute;
    padding: 0;
    margin: 0;
    list-style-type: none;
    box-shadow: 0 0 1px rgba(0,0,0,0.42);
    background: red;
    z-index: 10;
}
ul.ddown li {
    padding: 0;
    background: white;
    text-decoration:none;
}
ul.ddown li a {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.44;
    white-space: nowrap;
}
ul.ddown li a:hover,
ul.ddown li a:focus {
    background-color: #f3f4f5;
}
</style>
