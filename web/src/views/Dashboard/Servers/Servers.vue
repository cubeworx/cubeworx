<template>
  <Panel class="tsmp-panel-a" header="Your Servers">
    <template #icons>
      <button class="p-panel-header-icon p-link p-ml-2" @click="openCreateServer" v-tooltip.left="'Create a new server'">
        <i class="fas fa-plus-circle"></i>
      </button>
    </template>
    <template #default>
      <div class="server-browser p-d-flex p-flex-wrap p-ai-center">
        <Server v-for="container in $store.getters.sortedContainers" :key="container.id" :container="container" />
        <p v-if="$store.state.containers.length === 0">Create a server to get started!</p>
      </div>
      <CreateServerModal ref="createServerModal"/>
    </template>
  </Panel>
</template>

<script>
import Server from './Server.vue';
import CreateServerModal from './CreateServerModal.vue';

export default {
  name: 'Servers',
  components: {
    Server,
    CreateServerModal,
  },
  methods: {
    openCreateServer() {
      this.$refs.createServerModal.openModal();
    },
  },
  mounted() {
    this.$store.dispatch('getContainers')
      .catch((error) => {
        this.$toast.add({
          severity: 'error',
          summary: 'There was a problem fetching your servers.',
          detail: error.message,
        });
      });
  },
};
</script>

<style lang="less">
</style>
