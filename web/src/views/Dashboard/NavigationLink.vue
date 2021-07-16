<template>
  <router-link class="dashboard-navigation-link" exact-active-class="active p-shadow-2">
    <slot></slot>
  </router-link>
</template>

<style lang="less">
  .dashboard-navigation-link {
    display: flex;
    padding: 0 1.2em;
    height: 4em;
    text-decoration: none;
    position: relative;
    align-items: center;
    opacity: 0.4;
    font-size: 1em;

    > i {
      font-size: 2em;
      width: 1.5em;
    }

    &:after {
        content: '';
        position: absolute;
        display: none;
        left: 100%;
        top: 0;
        width: 0.5em;
        height: 100%;
        background-color: var(--dashboard-navigation-link-active-background-color);
        border-top-right-radius: 1em;
        border-bottom-right-radius: 1em;
    }

    &:hover {
      opacity: 0.75;
    }

    &.active {
      background-color: var(--dashboard-navigation-link-active-background-color);
      opacity: 1;

      &:after {
        display: block;
      }
    }
  }
</style>
