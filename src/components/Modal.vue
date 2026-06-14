<script setup>
  defineEmits(['close'])

  defineProps({
    size: {
      type: String,
      default: 'default'
    }
  })
</script>

<template>
    <Teleport to="body">
        <div class="modal-overlay" v-bind="$attrs" @click.self="$emit('close')">
            <div class="modal-content" :class="[`size-${size}`]">
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
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--bg-tertiary);
        border-radius: 12px;
        border: 2px solid var(--border-color);
        padding: 24px;
        position: relative;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .modal-content.size-default {
        width: 90%;
        max-width: 460px;
    }

    .modal-content.size-large {
        width: 95vw;
        max-width: 1200px;
        padding: 28px;
    }

    .modal-content.size-bio {
        width: 90vw;
        max-width: 680px;
        padding: 32px;
        border-color: rgba(255, 255, 255, 0.08);
    }

    .modal-content.size-playlist {
        width: 90vw;
        max-width: 600px;
        /* padding: 32px; */
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