<template>
<div class="record">

  <UnderConstruction/>

  <div>
    <div v-if="photo">
      <span class="glyphicon glyphicon-user" aria-hidden="true" style="font-size: 150px;"></span>
    </div>
    <div v-else>
      <span class="glyphicon glyphicon-user" aria-hidden="true" style="font-size: 150px;"></span>
      <p>No photo on file.</p>
    </div>
    <div>
      <h1>
        <span>Record for&#58; {{ name }}</span>
      </h1>
      <p>{{id}}</p>
      <p>{{email}}</p>
    </div>
  </div>

  <ul class="nav nav-tabs">
    <li id="tab_advisingContact"><a data-for-block="block_advisingContact">Contact Details</a></li>
    <li id="tab_interactionHistory"><a data-for-block="block_interactionHistory">History</a></li>
    <li id="tab_contactAttachments"><a data-for-block="block_contactAttachments">Attachments</a></li>
    <li v-show="numTeams > 0" id="tab_interactionCreate"><a data-for-modal="createInteractionModal">Create Interaction</a></li>
    <li id="tab_otherResources" class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" tabindex="0">External Resources<span class="caret"></span></a>
      <ul class="dropdown-menu">
        <li><a href="https://example.com" target="_blank" rel="noopener">Link</a></li>
        <li><a href="https://example.com" target="_blank" rel="noopener">Link</a></li>
        <li><a href="https://example.com" target="_blank" rel="noopener">Link</a></li>
        <li><a href="https://example.com" target="_blank" rel="noopener">Link</a></li>
      </ul>
    </li>
  </ul>

  <div v-if="mode === 'block_advisingContact'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_interactionHistory'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_contactAttachments'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_createInteraction'">
    {{mode}}
  </div>

  <div v-else>
    Unknown mode: {{mode}}
  </div>

</div>
</template>

<script>
import UnderConstruction from '@/components/UnderConstruction.vue'

export default {
  name: 'Record',
  components: {
    UnderConstruction
  },
    data() {
        return {
            mode: "block_advisingContact",
            photo: false,
            name: "Alex Great",
            contactId: 450,
            id: 123456789,
            email: "foo@bar.glux",
            numTeams: 1,
        }
    },
}
</script>
