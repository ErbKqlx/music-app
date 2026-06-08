<script setup>
    import { useToastStore } from '@/stores/toast'

    const toastStore = useToastStore()
</script>

<template>
    <div class="toast-container">
        <TransitionGroup name="toast">
            <div 
                v-for="toast in toastStore.toasts" 
                :key="toast.id" 
                :class="['toast-item', toast.type]"
                @click="toastStore.remove(toast.id)"
            >
                <span class="toast-icon">
                    <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="9" x2="12.01" y2="9"></line></svg>
                </span>
                
                <span class="toast-message">{{ toast.message }}</span>
                
                <button class="toast-close">✕</button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
    .toast-container {
        position: fixed;
        bottom: 24px;
        left: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
        pointer-events: none;
    }

    .toast-item {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-radius: 8px;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        min-width: 250px;
        max-width: 350px;
    }

    .toast-item.success {
        background-color: #1ed760;
        color: #000000;
    }
    .toast-item.error {
        background-color: #e91429;
    }
    .toast-item.info {
        background-color: #2e77d0;
    }

    .toast-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .toast-message {
        flex-grow: 1;
    }

    .toast-close {
        background: none;
        border: none;
        color: inherit;
        opacity: 0.6;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
    }
    .toast-close:hover {
        opacity: 1;
    }

    .toast-enter-from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }
    .toast-enter-to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    .toast-leave-from {
        opacity: 1;
        transform: scale(1);
    }
    .toast-leave-to {
        opacity: 0;
        transform: scale(0.8);
    }
    .toast-enter-active,
    .toast-leave-active {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>