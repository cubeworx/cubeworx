<template>
  <Modal title="Create Server" ref="modal">
    <template v-slot:content>
      <div class="p-fluid">
        <template v-if="busy">
          <div class="cbwx-progress-spinner">
            <ProgressSpinner />
          </div>
        </template>
        <template v-else>
          <div class="p-field">
              <label for="server-name">Server Name</label>
              <InputText id="server-name" type="text" v-model="serverName" autofocus />
          </div>
          <div class="p-field">
              <label for="image-name">Image Name</label>
              <InputText id="image-name" type="text" v-model="imageName" />
          </div>
          <div class="p-field">
              <label for="level-seed">Level Seed</label>
              <InputText id="level-seed" type="text" v-model="levelSeed" />
          </div>
        </template>
      </div>
    </template>
    <template v-slot:footer>
      <Button label="Cancel" icon="pi pi-times" @click="closeModal" class="p-button-text" :disabled="busy" />
      <Button label="Create Server" icon="pi pi-check" @click="$_createServer" :disabled="busy" />
    </template>
  </Modal>
</template>

<script>
import rpc from '@/api/rpc';

export default {
  name: 'CreateServerDialog',
  data() {
    return {
      serverName: null,
      imageName: 'cubeworx/mcbe-server:latest',
      levelSeed: null,
      busy: false,
    };
  },
  methods: {
    openModal() {
      this.serverName = 'NewServer';
      this.$refs.modal.openModal();
    },
    closeModal() {
      this.$refs.modal.closeModal();
    },
    $_createServer() {
      const params = {
        Image: this.imageName,
        Env: [
          'EULA=TRUE',
          `SERVER_NAME=${this.serverName}`,
          'SERVER_PORT=60000',
          `LEVEL_SEED=${this.levelSeed}`,
        ],
        ExposedPorts: {
          '60000/udp': {},
        },
        HostConfig: {
          PortBindings: {
            '60000/udp': [
              {
                HostPort: '0',
              },
            ],
          },
        },
      };
      this.busy = true;
      rpc('containers.create', params)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Success!.',
            detail: 'Your new server was created successfully.',
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
          this.closeModal();
          this.busy = false;
        });
    },
  },
};
</script>
