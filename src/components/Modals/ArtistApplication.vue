<script setup>
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Input from '@/components/Input/Input.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import router from '@/router/index.js';
    import ImageCropperModal from '@/components/Modals/ImageCropperModal.vue'
    import { useToastStore } from '../../stores/toast'
    import { usePlaylistStore } from '../../stores/playlist'

    const modalStore = useModalStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()
    const playlistStore = usePlaylistStore()

    const fileInput = ref(null)
    const previewImage = ref(null)
    const isEdit = computed(() => !!modalStore.modalData);

    const isCropping = ref(false)
    const rawImageSrc = ref(null)
    const currentFileType = ref('image/jpeg')

    const formData = reactive({
        name: modalStore.modalData?.name || '' ,
        public: modalStore.modalData?.public || false,
        image: modalStore.modalData?.image || null,
        id_user: Number(userStore.currentUser?.id)
    })

    function onFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')){
            alert('Пожалуйста, выберите изображение!')
            e.target.value = ''
            return
        }

        if (file.size > 50 * 1024 * 1024) {
            alert('Файл слишком большой (макс. 50МБ)')
            e.target.value = ''
            return
        }

        rawImageSrc.value = URL.createObjectURL(file)
        currentFileType.value = file.type
        isCropping.value = true
    }

    function handleCropConfirmed({ dataUrl, file }) {
        previewImage.value = dataUrl
        formData.image = file
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
        const data = new FormData()
        data.append('name', formData.name)
        data.append('public', formData.public ? 1 : 0)
        data.append('id_user', formData.id_user)

        if (formData.image) {
            data.append('image', formData.image)
        }

        const playlistId = modalStore.modalData?.id

        try{
            if (isEdit.value){
                await http.patch(`/playlist/${playlistId}`, data,
                {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                })
                
                await playlistStore.fetchPlaylists(userStore.currentUser.id)

                // router.push(`/playlist/${playlistId}`)
                location.reload()
                toastStore.show('Плейлист обновлен', 'success')
            }
            else{
                await http.post('/playlist', data,
                {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                });

                await playlistStore.fetchPlaylists(userStore.currentUser.id)

                // router.push(`/profile/${userStore.currentUser.id}`)
                toastStore.show('Плейлист добавлен', 'success')

            }
        }
        catch (error){
            console.log('Ошибка при создании плейлиста ' + error)
            toastStore.show('Ошибка при создании плейлиста', 'error')
        }

        modalStore.closeModal()
    }

    onMounted(() => {
        if (modalStore.modalData) {
            previewImage.value = modalStore.modalData.image
        }
    })
</script>

<template>
    <Modal @close="modalStore.closeModal">
        <template #header>
            <h2 class="modal-title">Заявка</h2>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" class="create-playlist-form">
                <div class="inputs-section">
                    <div class="field">
                        <label>Название</label>
                        <input 
                            type="text"
                            v-model="formData.name" 
                            placeholder="Мой плейлист" 
                            required>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal">Отмена</Button>
                <Button @click="handleSubmit">{{ isEdit ? 'Сохранить' : 'Создать' }}</Button>
            </div>
        </template>
    </Modal>

    <ImageCropperModal 
        v-if="isCropping"
        class="cropper-modal"
        :image-src="rawImageSrc"
        :file-type="currentFileType"
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

    .create-playlist-form {
        display: flex;
        gap: 20px;
        padding: 10px 0;
    }

    .upload-section {
        width: 180px;
        height: 180px;
        background-color: #282828;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        transition: background-color 0.3s;
        flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    .upload-section:hover {
        background-color: #333;
    }

    .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        color: var(--secondary-text-color);
        font-size: 14px;
    }

    .image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .inputs-section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 8px;

        input[type='text']{
            border-radius: 5px;
            height: 33px;
            font-size: 20px;
            background-color: rgb(217 , 217, 217);
            border: none;
            padding-left: 5px;
            width: 100%;
        }
    }

    .field label {
        font-size: 14px;
        font-weight: bold;
        color: var(--text-primary);
    }

    .checkbox-field {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-top: 10px;
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

    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }

    .switch input { display: none; }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #555;
        transition: .4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider { background-color: var(--accent-color, #5577ee); }
    input:checked + .slider:before { transform: translateX(20px); }

    :deep(.cropper-modal.modal-overlay) {
        z-index: 1100;
        background: rgba(0, 0, 0, 0.85);
    }
</style>