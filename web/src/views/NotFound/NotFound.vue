<template>
  <div id="main" class="p-d-flex p-ai-center p-jc-center">
    <div class="message p-d-flex p-flex-column p-ai-center p-jc-center">
      <span class="text">Whatever you were looking for, it's not here.</span>
      <span class="fas fa-sad-tear"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped lang="less">
  #main {
    height: 100%;

    > .message {
      font-size: 2em;

      > .text {
        margin-bottom: 1em;
      }

      > .fas {
        font-size: 3em;
      }
    }
  }
</style>
