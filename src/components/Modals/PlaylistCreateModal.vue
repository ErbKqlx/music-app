<script setup>
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Input from '@/components/Input/Input.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'

    const modalStore = useModalStore()
    const userStore = useUserStore()

    const fileInput = ref(null)
    const previewImage = ref(null)
    const isEdit = computed(() => !!modalStore.modalData);

    const formData = reactive({
        name: modalStore.modalData?.name || '' ,
        public: modalStore.modalData?.public || false,
        image: modalStore.modalData?.image || null,
        id_user: Number(userStore.currentUser?.id)
    })

    function onFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            formData.image = file
            previewImage.value = URL.createObjectURL(file)
        }
    }

    function triggerFileInput() {
        fileInput.value.click()
        console.log(modalStore.modalData?.image)
        
    }

    async function handleSubmit() {
        if (!formData.name.trim()) return alert('Введите название плейлиста')

        const data = new FormData()
        data.append('name', formData.name)
        data.append('public', formData.public ? 1 : 0)
        data.append('id_user', formData.id_user)

        // if (form.image) formData.append('image', form.image)
        if (formData.image instanceof File) {
            data.append('image', formData.image)
        }

        const playlistId = modalStore.modalData?.id
        console.log(playlistId)

        try{
            // console.log(formData.value)
            if (isEdit.value){
                // console.log(data)
                await http.patch(`/playlist/${playlistId}`, data,
                {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                })
            }
            else{
                await axios.post('/playlist', data,
                {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                });
            }
            // const playlist = 
            // playlistsData.value = playlists.data
            

            
            // console.log(userData.value)
        }
        catch (error){
            // if (error.response.status == 401){
            //     router.push('/')
            // }
            console.log('Ошибка при создании плейлиста ' + error)
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
            <!-- <h2 class="modal-title" v-if="!isEdit">Создание плейлиста</h2>
            <h2 class="modal-title" v-else>Редактирование плейлиста</h2> -->
            <h2 class="modal-title">{{ isEdit ? 'Редактирование' : 'Создание' }} плейлиста</h2>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" class="create-playlist-form">
                <div class="upload-section" @click="triggerFileInput">
                    <div v-if="previewImage" class="image-preview">
                        <img :src="previewImage" alt="Превью" />
                    </div>
                    <div v-else class="upload-placeholder">
                        <span>Выбрать обложку</span>
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
                        <label>Название</label>
                        <input 
                            type="text"
                            v-model="formData.name" 
                            placeholder="Мой плейлист" 
                            required>
                    </div>

                    <div class="field checkbox-field">
                        <label class="switch">
                            <input type="checkbox" v-model="formData.public" :value="formData.public">
                            <span class="slider"></span>
                        </label>
                        <span>Публичный плейлист</span>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary" @click="modalStore.closeModal">Отмена</Button>
                <Button @click="handleSubmit">{{ isEdit ? 'Сохранить' : 'Создать' }}</Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .modal-title {
        margin: 0;
        font-size: 1.5rem;
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
        color: #efefef;
    }

    .checkbox-field {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-top: 10px;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        width: 100%;
    }

    .secondary {
        /* background: ; */
        border: 1px solid #555;
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
</style>