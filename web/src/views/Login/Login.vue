<template>
  <div id='main' class='p-d-flex p-ai-center p-jc-center'>
      <Button class='p-button-lg' v-on:click='onClickedLogin()'>Login</Button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    onClickedLogin() {
      this.$router.push('/dashboard/servers');
    },
  },
};
</script>

<style scoped lang='less'>
  #main {
    height: 100%;
  }
</style>
