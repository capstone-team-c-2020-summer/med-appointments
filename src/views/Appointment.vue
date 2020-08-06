<template>
<div class="appointment">

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
        <span>Interaction&#58;
          <router-link :to="{ name: 'Record', params: { id: contactId }}">
            {{ name }}
          </router-link>
        </span>
        <br />
        <span style="font-size: medium;" title="subject">&quot;{{subject}}&quot;</span>
        <span style="font-size: medium;">created on {{createdOn}}</span>
      </h1>
    </div>
  </div>

  <ul class="nav nav-tabs">
    <li id="tab_advisingInteraction"><a data-for-block="block_advisingInteraction">Advising</a></li>
    <li v-show="atLeastTeamMember" id="tab_interactionHistory"><a data-for-block="block_interactionHistory">History</a></li>
    <li v-show="atLeastTeamMember" id="tab_messages"><a data-for-block="block_messages">Messages</a></li>
    <li v-show="atLeastTeamReadonlyAccess" id="tab_contactAttachments"><a data-for-block="block_contactAttachments">Attachments</a></li>
    <li id="tab_privateNotes"><a data-for-block="block_privateNotes">Private Notes</a></li>
    <li id="tab_interactionProperties"><a data-for-block="block_interactionProperties">Properties</a></li>
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

  <div v-if="mode === 'block_advisingInteraction'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_interactionHistory'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_messages'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_contactAttachments'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_privateNotes'">
    {{mode}}
  </div>

  <div v-else-if="mode === 'block_interactionProperties'">
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
    name: 'Appointment',
    components: {
        UnderConstruction
    },
    data() {
        return {
            mode: "block_advisingInteraction",
            photo: false,
            name: "Alex Great",
            contactId: 450,
            subject: "Subject line here",
            createdOn: "2000-01-01",
            atLeastTeamMember: true,
            atLeastTeamReadonlyAccess: true,
        }
    },
}
</script>
