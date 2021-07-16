<template>
  <Panel class="tsmp-panel-b tsmp-server p-shadow-2" :header=displayTitle>
    <template #icons>
      <button class="p-panel-header-icon p-link p-ml-2" @click="onClickedShowLogs" v-tooltip.left="'View recent logs'">
        <i class="fas fa-info-circle"></i>
      </button>
      <button v-if="container.status === 'running'" class="p-panel-header-icon p-link p-ml-2" @click="onClickedStopServer($event)" :disabled="busy" v-tooltip.left="'Stop server'">
        <i v-if="!busy" class="fas fa-stop-circle"></i>
        <i v-if="busy" class="fas fa-sync-alt fa-spin"></i>
      </button>
      <button v-if="container.status === 'exited'" class="p-panel-header-icon p-link p-ml-2" @click="onClickedStartServer" :disabled="busy" v-tooltip.left="'Start server'">
        <i v-if="!busy" class="fas fa-play-circle"></i>
        <i v-if="busy" class="fas fa-sync-alt fa-spin"></i>
      </button>
    </template>
    <div class="tsmp-content">
      <table>
        <tbody>
          <tr>
            <td>Container Name</td>
            <td>{{container.name}}</td>
          </tr>
          <tr>
            <td>Container Status</td>
            <td>{{container.status}}</td>
          </tr>
          <tr>
            <td>Container Image</td>
            <td>{{container.image}}</td>
          </tr>
          <tr>
            <td>Container Address</td>
            <td>{{container.ipAddress || 'None'}}</td>
          </tr>
          <tr>
            <td>Private Port</td>
            <td>{{container.privatePort || 'None'}}</td>
          </tr>
          <tr>
            <td>Public Port</td>
            <td>{{container.publicPort || 'None'}}</td>
          </tr>
          <template v-if="container.server">
            <tr>
              <td>MOTD1</td>
              <td>{{container.server.motd1}}</td>
            </tr>
            <tr>
              <td>MOTD2</td>
              <td>{{container.server.motd2}}</td>
            </tr>
            <tr>
              <td>Players</td>
              <td>{{container.server.playerCount}} / {{container.server.maxPlayerCount}}</td>
            </tr>
            <tr>
              <td>Edition</td>
              <td>{{container.server.edition}}</td>
            </tr>
            <tr>
              <td>Mode</td>
              <td>{{container.server.mode}}</td>
            </tr>
            <tr>
              <td>Protocol</td>
              <td>{{container.server.protocol}}</td>
            </tr>
            <tr>
              <td>Version</td>
              <td>{{container.server.version}}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <p v-if="container.status === 'running' && !container.server">Waiting for response from server...</p>
    </div>
  </Panel>
  <ServerLogsModal ref="serverLogsModal" :container="container"/>
</template>

<script>
import rpc from '@/api/rpc';
import ServerLogsModal from './ServerLogsModal.vue';

export default {
  name: 'Server',
  props: {
    container: Object,
  },
  components: {
    ServerLogsModal,
  },
  data() {
    return {
      busy: false,
    };
  },
  computed: {
    displayTitle() {
      return this.container.server ? this.container.server.motd1 : this.container.serverName || this.container.name || 'Unknown';
    },
  },
  methods: {
    onClickedStartServer() {
      this.busy = true;
      rpc('containers.start', { containerId: this.container.id })
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Success!.',
            detail: 'Your server was started successfully.',
            closable: false,
            life: 3000,
          });
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
    onClickedStopServer(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to stop this server?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.busy = true;
          rpc('containers.stop', { containerId: this.container.id })
            .then(() => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success!.',
                detail: 'Your server was stopped successfully.',
                closable: false,
                life: 3000,
              });
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
      });
    },
    onClickedShowLogs() {
      this.$refs.serverLogsModal.openModal();
    },
  },
};
</script>

<style lang="less">
  .tsmp-server .tsmp-content {
    font-size: 14px;
    min-width: 350px;

    > table td:first-child {
        padding-right: 2em;
    }
  }
</style>
