<template>
  <teleport to="#modal-container">
    <Dialog :header=title v-model:visible="visible" :modal="true" :closable="false">
      <slot name="content"></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </Dialog>
  </teleport>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: String,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
    },
  },
};
</script>
