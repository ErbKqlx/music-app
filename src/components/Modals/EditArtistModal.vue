<script setup>
    import { computed, onMounted, reactive, ref, watch } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import { useToastStore } from '../../stores/toast.js'
    import ImageCropperModal from './ImageCropperModal.vue'

    const modalStore = useModalStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()

    const isLoading = ref(false)

    const formData = reactive({
        name: '',
        bio: '',
    })

    function updateFormValues() {
        if (modalStore.modalData) {
            formData.name = modalStore.modalData.name || ''
            formData.bio = modalStore.modalData.bio || ''
        }
    }

    watch(
        () => modalStore.modalData,
        () => {
            updateFormValues()
        },
        { deep: true, immediate: true }
    )

    async function handleSubmit() {
        if (!formData.name.trim()) {
            toastStore.show('Псевдоним исполнителя не может быть пустым', 'error')
            return
        }

        try {
            isLoading.value = true
            const artistId = modalStore.modalData?.id

            if (!artistId) {
                toastStore.show('Идентификатор исполнителя не найден', 'error')
                return
            }
            
            const data = {
                name: formData.name.trim(),
                bio: formData.bio.trim()
            }

            const response = await http.patch(`/artists/${artistId}`, data, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })

            toastStore.show('Профиль исполнителя успешно обновлен', 'success')
            
            if (modalStore.modalData?.onSuccess) {
                modalStore.modalData.onSuccess({
                    name: formData.name.trim(),
                    bio: formData.bio.trim()
                })
            }

            modalStore.closeModal()
        } catch (error) {
            console.error('Ошибка при редактировании профиля исполнителя:', error)
            toastStore.show('Ошибка при редактировании профиля исполнителя', 'error')
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <Modal @close="modalStore.closeModal" size="playlist">
        <template #header>
            <h2 class="modal-title">Редактирование профиля исполнителя</h2>
        </template>

        <template #body>
            <div v-if="isLoading" class="loading">Сохранение изменений...</div>
            
            <form v-else @submit.prevent="handleSubmit" id="editArtistForm" class="edit-profile-form">
                <div class="inputs-section">
                    <div class="field">
                        <label>Псевдоним исполнителя</label>
                        <input 
                            type="text"
                            v-model="formData.name" 
                            placeholder="Ваш псевдоним" 
                            required
                        >
                    </div>

                    <div class="field">
                        <label>Биография</label>
                        <textarea 
                            v-model="formData.bio" 
                            placeholder="Введите свою биографию"
                            class="bio-textarea"
                        ></textarea>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal" :disabled="isLoading">Отмена</Button>
                <Button type="submit" form="editArtistForm" :disabled="isLoading">Сохранить</Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
    }

    .edit-profile-form {
        display: flex;
        gap: 24px;
        padding: 10px 0;
        width: 600px;
        max-width: 100%;
    }

    .inputs-section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 8px;

        input[type='text'], .bio-textarea {
            border-radius: 5px;
            font-size: 16px;
            background-color: #e0e0e0;
            color: #121212;
            border: none;
            padding: 12px;
            width: 100%;
            outline: none;
            font-family: inherit;
        }

        input[type='text'] {
            height: 38px;
            padding: 0 12px;
        }

        .bio-textarea {
            height: 120px;
            resize: vertical;
        }
    }

    .field label {
        font-size: 14px;
        font-weight: bold;
        color: var(--text-primary);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        width: 100%;
    }

    .secondary-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--text-primary);
    }
    
    .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .loading {
        text-align: center;
        padding: 40px;
        font-size: 18px;
        color: var(--text-secondary);
    }
</style>