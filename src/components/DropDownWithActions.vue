<template>
<div>
  <div>
    <button v-on:click="toggle()"
            v-on:blur="debounce()"
            class="btn"
            :class="btnClass"
            >
      {{btnLabel}}
      <span :class="btnStatus"></span>
    </button>
    <div v-on:focus="hold()">
      <ul v-show="showing"
          class="ddown"
          v-on:focus="hold()"
          >
        <li v-for="current in actions"
            v-on:focus="hold()"
            v-bind:key="current.id"
            >
          <a href="#"
             :data-value="current.value"
             :data-result="current.result"
             v-on:focus="hold()"
             v-on:blur="debounce()"
             v-on:click.stop.prevent="doAction($event)"
             v-on:keydown.space="doAction($event)"
             >
            {{current.name}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
    name: "DropDownWithActions",
    props: [
        "actions",
        "condition",
        "endpoint",
        "id",
    ],
    mounted() {
        this.initData()
    },
    data() {
        return {
            blob: "",
            errorPrompt: "",
            holding: false,
            pristine: true,
            showing: false,
            status: "",
            timer: "",
            updating: false,
        }
    },
    computed: {
        btnClass: function() {
            //TODO: If we want general reuse, this needs currying and
            //      to get logic as a function from the props
            return this.updating ? "btn-default"
                : this.status === "Scheduled" ? "btn-primary"
                : this.status === "Checked In" ? "btn-success"
                : this.status === "Active" ? "btn-info"
                : this.status === "Canceled" ||  this.status === "Finished" ||  this.status === "No-show" ? "btn-warning"
                : "btn-danger";
        },
        btnLabel: function() {
            return this.updating ? "Loading..." : this.status
        },
        btnStatus: function() {
            return this.updating ? "glyphicon glyphicon-transfer"
                : this.errorPrompt ? "glyphicon glyphicon-alert"
                : this.status !== this.condition || !this.pristine ? "glyphicon glyphicon-saved"
                : "caret"
        },
        
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
        doAction: function(event) {
            this.pristine = false
            this.updating = true
            this.showing = false
            this.holding = false
            
            const payload = { id:this.id, condition:event.target.dataset.value }
            
            // console.log(this.endpoint)
            // console.info(JSON.stringify(payload))
            
            if (this.endpoint) {
                fetch(this.endpoint, {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json && json.status === "success") {
                            this.blob = json
                            this.status = event.target.dataset.result
                            this.$emit("update", this.status)
                            this.updating = false
                        } else {
                            this.errorPrompt = "Response failed."
                            this.updating = false
                        }
                    })
                    .catch(error => {
                        this.errorPrompt = `Request failed. ${error}`
                        this.updating = false
                    })
            } else {
                this.errorPrompt = "No configuration."
                this.updating = false
            }
        },
        initData: function() {
            this.blob = ""
            this.errorPrompt = ""
            this.holding = false
            this.showing = false
            this.status = this.condition
            this.timer = ""
            this.updating = false
            this.pristine = true
        },
    },
    watch: {
        condition() { this.initData() },
        id() { this.initData() },
        blob() { console.info("blob"); console.info(JSON.stringify(this.blob)) },
        errorPrompt() { console.info("errs"); console.error(JSON.stringify(this.errorPrompt)) },
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
