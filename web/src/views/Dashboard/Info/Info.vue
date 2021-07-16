<template>
  <Panel class="tsmp-panel-a" header="Hosting Information">
    <template #default>
      <pre class="json-display">{{info}}</pre>
    </template>
  </Panel>
</template>

<script>
import rpc from '@/api/rpc';

export default {
  name: 'Info',
  data() {
    return {
      hostingInfo: null,
    };
  },
  computed: {
    info() {
      return this.hostingInfo ? JSON.stringify(this.hostingInfo, null, 2) : null;
    },
  },
  mounted() {
    rpc('system.info')
      .then((hostingInfo) => {
        this.hostingInfo = hostingInfo;
      })
      .catch(() => {});
  },
};
</script>

<style lang="less">
  .json-display {
    margin: 0;
    font-size: 12px;
  }
</style>
