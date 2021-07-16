<template>
  <div class="demo demo-surface-a">
    <p class="demo-text-color">Surface A - Text Color</p>
    <p class="demo-text-color-secondary">Surface A - Text Color Secondary</p>
  </div>
  <div class="demo demo-surface-b">
    <p class="demo-text-color">Surface B - Text Color</p>
    <p class="demo-text-color-secondary">Surface B - Text Color Secondary</p>
  </div>
  <div class="demo demo-surface-c">
    <p class="demo-text-color">Surface C - Text Color</p>
    <p class="demo-text-color-secondary">Surface C - Text Color Secondary</p>
  </div>
  <div class="demo demo-surface-d">
    <p class="demo-text-color">Surface D - Text Color</p>
    <p class="demo-text-color-secondary">Surface D - Text Color Secondary</p>
  </div>
  <div class="demo demo-surface-e">
    <p class="demo-text-color">Surface E - Text Color</p>
    <p class="demo-text-color-secondary">Surface E - Text Color Secondary</p>
  </div>
  <div class="demo demo-surface-f">
    <p class="demo-text-color">Surface F - Text Color</p>
    <p class="demo-text-color-secondary">Surface F - Text Color Secondary</p>
  </div>
  <div class="demo demo-primary-color">
    <p class="demo-primary-color-text">Primary Color - Primary Color Text</p>
  </div>
  <Button>Default Button</Button>
</template>

<script>
export default {
  name: 'ThemeTest',
};
</script>

<style scoped lang="less">
.demo {
  padding: 2em;
  color: var(--text-color);

  > p:last-of-type {
    margin: 0;
  }
}

.demo-surface-a {
  background-color: var(--surface-a);
}
.demo-surface-b {
  background-color: var(--surface-b);
}
.demo-surface-c {
  background-color: var(--surface-c);
}
.demo-surface-d {
  background-color: var(--surface-d);
}
.demo-surface-e {
  background-color: var(--surface-e);
}
.demo-surface-f {
  background-color: var(--surface-f);
}
.demo-primary-color {
  background-color: var(--primary-color);
}
.demo-text-color {
  color: var(--text-color);
}
.demo-text-color-secondary {
  color: var(--text-color-secondary);
}
.demo-primary-color-text {
  color: var(--primary-color-text);
}

button {
  margin: 1em;
}
</style>
