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

    const fileInput = ref(null)
    const previewImage = ref(null)
    const isLoading = ref(false)

    const isCropping = ref(false)
    const rawImageSrc = ref(null)
    const currentFileType = ref('image/jpeg')

    const formData = reactive({
        username: userStore.currentUser?.username || '',
        avatar: null
    })

    function onFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toastStore.show('Пожалуйста, выберите изображение!', 'error')
            e.target.value = ''
            return
        }

        if (file.size > 20 * 1024 * 1024) {
            toastStore.show('Файл слишком большой (макс. 20МБ)', 'error')
            e.target.value = ''
            return
        }

        rawImageSrc.value = URL.createObjectURL(file)
        currentFileType.value = file.type
        isCropping.value = true
    }

    function handleCropConfirmed({ dataUrl, file }) {
        previewImage.value = dataUrl
        formData.avatar = file
        isCropping.value = false
        
        if (fileInput.value) fileInput.value.value = ''
    }

    function cancelCrop() {
        isCropping.value = false
        if (rawImageSrc.value) URL.revokeObjectURL(rawImageSrc.value)
        if (fileInput.value) fileInput.value.value = ''
    }

    function triggerFileInput() {
        if (!isCropping.value) {
            fileInput.value.click()
        }
    }

    async function handleSubmit() {
        if (!formData.username.trim()) {
            toastStore.show('Имя пользователя не может быть пустым', 'error')
            return
        }

        const data = new FormData()
        data.append('username', formData.username.trim())
        if (formData.avatar) {
            data.append('avatar', formData.avatar)
        }

        console.log("Тип отправляемого аватара:", typeof formData.avatar, formData.avatar);

        try {
            isLoading.value = true
            const userId = userStore.currentUser?.id
            
            const response = await http.patch(`/users/${userId}`, data, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })

            if (response.data && response.data.data.user) {
                userStore.setUser(response.data.data.user)
            }

            toastStore.show('Профиль успешно обновлен', 'success')
            modalStore.closeModal()
            
            // location.reload()
        } catch (error) {
            console.error('Ошибка при редактировании профиля:', error)
            toastStore.show('Ошибка при редактировании профиля', 'error')
        }

        isLoading.value = false
    }

    onMounted(() => {
        if (userStore.currentUser) {
            previewImage.value = userStore.currentUser.avatar
        }
    })
</script>

<template>
    <Modal @close="modalStore.closeModal" size="playlist">
        <template #header>
            <h2 class="modal-title">Редактирование профиля</h2>
        </template>

        <template #body>
            <div v-if="isLoading" class="loading">Сохранение изменений...</div>
            
            <form v-else @submit.prevent="handleSubmit" class="edit-profile-form">
                <div class="upload-section" @click="triggerFileInput" title="Сменить аватарку">
                    <div v-if="previewImage" class="image-preview">
                        <img :src="previewImage" />
                        <div class="avatar-edit-overlay">
                            <span>Изменить</span>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref="fileInput" 
                        @change="onFileChange" 
                        accept="image/*" 
                        hidden 
                    />
                </div>

                <div class="inputs-section">
                    <div class="field">
                        <label>Имя пользователя</label>
                        <input 
                            type="text"
                            v-model="formData.username" 
                            placeholder="Ваше имя" 
                            required
                        >
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal" :disabled="isLoading">Отмена</Button>
                <Button @click="handleSubmit" :disabled="isLoading">Сохранить</Button>
            </div>
        </template>
    </Modal>

    <ImageCropperModal 
        v-if="isCropping"
        class="cropper-modal"
        :image-src="rawImageSrc"
        :file-type="currentFileType"
        :is-avatar="true"
        @confirmed="handleCropConfirmed"
        @cancel="cancelCrop"
    />
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

    .upload-section {
        width: 180px;
        height: 180px;
        background-color: #282828;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        transition: background-color 0.3s, transform 0.2s;
        flex-shrink: 0;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);

        &:hover {
            background-color: #333;
            transform: scale(1.02);
        }
    }

    .upload-section:hover .avatar-edit-overlay {
        opacity: 1;
    }

    .upload-placeholder {
        color: var(--text-secondary, #a7a7a7);
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .upload-icon {
            font-size: 24px;
        }
    }

    .image-preview {
        position: relative;
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            
        }
    }

    .avatar-edit-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 15px;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
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

        input[type='text']{
            border-radius: 5px;
            height: 38px;
            font-size: 16px;
            background-color: #e0e0e0;
            color: #121212;
            border: none;
            padding: 0 12px;
            width: 100%;
            outline: none;
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

    :deep(.cropper-modal.modal-overlay) {
        z-index: 1100;
        background: rgba(0, 0, 0, 0.85);
    }
</style>