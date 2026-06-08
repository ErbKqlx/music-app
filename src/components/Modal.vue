<script setup>
    defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" v-bind="$attrs" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-button" @click="$emit('close')">✕</button>

        <header v-if="$slots.header" class="modal-header">
          <slot name="header"></slot>
        </header>

        <main class="modal-body">
          <slot name="body"></slot>
        </main>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--bg-tertiary);
        border-radius: 12px;
        border: 2px solid var(--border-color);
        /* width: 90%; */
        /* max-width: 600px; */
        padding: 24px;
        position: relative;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .close-button {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 24px;
        cursor: pointer;
    }

    .close-button:hover {
        color: var(--text-secondary);
    }

    .modal-header {
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border-hover);
        padding-bottom: 10px;
    }

    .modal-footer {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>