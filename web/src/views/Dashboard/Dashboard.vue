<template>
  <div id="dashboard">
    <header class="header p-shadow-8">
      <img class="logo" alt="Logo" src="@/assets/logo.png" width="70" height="70" />
      <h1>cbwx</h1>
    </header>
    <main class="main">
      <div class="sidebar">
        <Navigation />
      </div>
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

export default {
  name: 'Dashboard',
  components: {
    Navigation,
  },
};
</script>

<style lang="less">
  #dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;

    > .header {
      background-color: var(--dashboard-header-background-color);
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;

      > img.logo {
        margin: 0 0.5em;
      }

      > h1 {
        margin: 0;
      }
    }

    > .main {
      flex-grow: 1;
      min-height: 0;
      display: flex;
      flex-direction: row;
      align-items: stretch;

      > .sidebar {
        background-color: var(--dashboard-sidebar-background-color);
        margin-right: 1em;
      }

      > .content {
        flex-grow: 1;
        padding: 1em;
        overflow-y: auto;
      }
    }
  }
</style>
