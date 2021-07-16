<template>
  <router-view />
  <div id="modal-container"></div>
  <ConfirmPopup></ConfirmPopup>
  <Toast position="bottom-center" />
</template>

<script>
import ConfirmPopup from 'primevue/confirmpopup';
import rpc from '@/api/rpc';

export default {
  name: 'App',
  components: {
    ConfirmPopup,
  },
  mounted() {
    rpc('templates.list')
      .then((response) => {
        console.log('templates:');
        console.log(response);
      });
  },
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
