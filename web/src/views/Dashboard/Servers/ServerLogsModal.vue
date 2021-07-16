<template>
  <Modal title="View Logs" ref="modal">
    <template v-slot:content>
      <template v-if="busy">
        <div class="tsmp-progress-spinner">
          <ProgressSpinner />
        </div>
      </template>
      <template v-else>
        <div class="tsmp-logging-output">
          <span v-for="log in logs" :key="log">{{log}}</span>
        </div>
      </template>
    </template>
    <template v-slot:footer>
      <Button label="Done" icon="pi pi-check" @click="closeModal" />
    </template>
  </Modal>
</template>

<script>
import rpc from '@/api/rpc';

export default {
  name: 'ServerLogsModal',
  props: {
    container: Object,
  },
  data() {
    return {
      busy: false,
      logs: [],
    };
  },
  methods: {
    openModal() {
      this.$refs.modal.openModal();
      this.requestLogs();
    },
    closeModal() {
      this.$refs.modal.closeModal();
    },
    requestLogs() {
      this.busy = true;
      rpc('containers.logs', { containerId: this.container.id })
        .then((response) => {
          this.logs = response;
        })
        .catch((error) => {
          this.$toast.add({
            severity: 'error',
            summary: 'Failed!',
            detail: error.message,
          });
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="less">
  .tsmp-logging-output {
    font-family: monospace;
    font-size: 12px;

    > span {
      display: block;
    }
  }
</style>
