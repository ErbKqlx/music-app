<script setup>
    import Modal from '@/components/Modal.vue'; 
    import { useModalStore } from '@/stores/modal';

    const modalStore = useModalStore();
</script>

<template>
    <div class="modals-container">
        <Modal 
            @close="modalStore.closeModal"
            size="bio" 
        >
            <template #header>
                <h2 class="modal-title">Биография</h2>
            </template>

            <template #body>
                <div class="bio-modal-body">
                    <h3 class="artist-name">{{ modalStore.modalData?.name }}</h3>
                    <p class="artist-bio-text">{{ modalStore.modalData?.bio }}</p>
                </div>
            </template>
        </Modal>
    </div>
</template>

<style scoped>
    .modal-title {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: var(--text-secondary);
        opacity: 0.7;
    }

    .bio-modal-body {
        max-height: 55vh;
        overflow-y: auto;
        padding-right: 12px;
        margin-top: 16px;

        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.25);
        }

        .artist-name {
            margin: 0 0 20px 0;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -1px;
            color: var(--text-primary);
        }

        .artist-bio-text {
            margin: 0;
            font-size: 16px;
            line-height: 1.75;
            color: var(--text-secondary);
            font-weight: 400;
            white-space: pre-line;
            word-break: break-word;
            margin-bottom: 8px; 
        }
    }
</style>