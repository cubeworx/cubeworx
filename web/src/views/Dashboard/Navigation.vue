<template>
  <ul class="main-navigation">
    <li><NavigationLink to="servers"><i class="fas fa-server"></i>Servers</NavigationLink></li>
    <li><NavigationLink to="explore"><i class="fas fa-search"></i>Explore</NavigationLink></li>
    <li><NavigationLink to="users"><i class="fas fa-address-card"></i>Users</NavigationLink></li>
    <li><NavigationLink to="settings"><i class="fas fa-sliders-h"></i>Settings</NavigationLink></li>
    <li><NavigationLink to="info"><i class="fas fa-question"></i>Info</NavigationLink></li>
  </ul>
</template>

<script>
import NavigationLink from './NavigationLink.vue';

export default {
  name: 'Navigation',
  components: {
    NavigationLink,
  },
};
</script>

<style lang="less">
  ul.main-navigation {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 1em 0;
  }
</style>
