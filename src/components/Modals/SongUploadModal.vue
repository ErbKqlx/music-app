<script setup>
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Input from '@/components/Input/Input.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import router from '@/router/index.js';
    import { helpers, required } from '@vuelidate/validators'
    import useVuelidate from '@vuelidate/core'

    const modalStore = useModalStore()
    const userStore = useUserStore()

    const fileInput = ref(null)
    const previewImage = ref(null)
    const isEdit = computed(() => !!modalStore.modalData);

    const genresData = ref([])

    const rules = {
        data: {
            name: { required: helpers.withMessage('Поле не может быть пустым', required) },
            song_file: { required: helpers.withMessage('Вы должны загрузить трек', required), },
        }
        
    }

    const formData = reactive({
        name: modalStore.modalData?.name || '',
        length: modalStore.modalData?.length || 0,
        release_date: modalStore.modalData?.release_date || new Date().toISOString().split('T')[0],
        explicit_content: modalStore.modalData?.explicit_content || false,
        lyrics: modalStore.modalData?.lyrics || '',
        image: modalStore.modalData?.image || null,
        song_file: null,
        id_user: Number(userStore.currentUser?.id)
    })

    const $v = useVuelidate(rules, formData)

    function onImageChange(e) {
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

        formData.image = file
        previewImage.value = URL.createObjectURL(file)
    }

    function onAudioChange(e){
        const file = e.target.files[0]
        if (!file || !file.type.startsWith('audio/')) {
            alert('Пожалуйста, выберите аудиофайл!')
            return
        }
        formData.song_file = file
        
        // const audio = new Audio()
        const fileURL = URL.createObjectURL(file);

        const sound = new Howl({
            src: [fileURL],
            format: [file.name.split('.').pop()],
            onload: function() {
                formData.length = Math.round(sound.duration());
                
                URL.revokeObjectURL(fileURL);
                sound.unload(); 
            },
            onloaderror: function(id, error) {
                console.error('Ошибка при чтении файла: ', error);
            }
        });

        // audio.src = URL.createObjectURL(file)
        // audio.addEventListener('loadedmetadata', () => {
        //     formData.length = Math.round(audio.duration)
        // })
    }

    function triggerFileInput() {
        fileInput.value.click()
        console.log(modalStore.modalData?.image)
        
    }

    async function handleSubmit() {
        // $v.value.$touch()

        if (true){
            // !formData.name.trim()

            console.log('a')

            const data = new FormData()
            data.append('name', formData.name)
            data.append('public', formData.public ? 1 : 0)
            data.append('release_date', formData.release_date)
            data.append('explicit_content', formData.explicit_content ? 1 : 0)
            data.append('lyrics', formData.lyrics)
            // length: modalStore.modalData?.length || 0,
            // image: modalStore.modalData?.image || null,
            // song_file: null,



            // data.append('id_user', formData.id_user)

            
            // if (form.image) formData.append('image', form.image)
            if (formData.image) {
                data.append('image', formData.image)
            }

            const songId = modalStore.modalData?.id
            // console.log(playlistId)

            try{
                if (isEdit.value){
                    await http.patch(`/song/${songId}`, data,
                    {
                        headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                    })
                    
                    // router.push(`/playlist/${playlistId}`)
                    location.reload()
                }
                else{
                    // console.log(data.get('image'));
                    await http.post('/song', data,
                    {
                        headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                    });

                    // const 

                    router.push(`/song/${song.id}`)
                }

                // router.push('/')
            }
            catch (error){
                console.log('Ошибка при загрузке трека ' + error)
            }

            modalStore.closeModal()
        }
    }

    async function fetchGenresData(){
        try{
            const genres = await http.get('/genres', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            genresData.value = genres.data
            // console.log(genreData.value)
        }
        catch (error){
            console.log('Ошибка при загрузке жанров ' + error)
        }
    }

    onMounted(() => {
        if (modalStore.modalData) {
            previewImage.value = modalStore.modalData.image
        }

        fetchGenresData()
    })
</script>

<template>
    <Modal @close="modalStore.closeModal">
        <template #header>
            <h2 class="modal-title">{{ isEdit ? 'Редактирование' : 'Загрузка' }} трека</h2>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" novalidate class="create-song-form">
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
                        @change="onImageChange" 
                        accept="image/*" 
                        hidden 
                    />
                </div>

                <div class="inputs-section">
                    <div class="field">
                        <label>Название <span style="color:red;">*</span></label>
                        <input 
                            type="text"
                            v-model="formData.name" 
                            placeholder="Мой трек" 
                            required>
                            <span class="error" v-for="error of $v.data.name.$errors" :key="error.$uid">{{ error.$message }}</span>
                    </div>

                    <div class="field">
                        <label>Файл трека (.mp3, .wav) <span style="color:red;">*</span></label>
                        <input type="file" @change="onAudioChange" accept="audio/*" :required="!isEdit">
                        <span class="error" v-for="error of $v.data.song_file.$errors" :key="error.$uid">{{ error.$message }}</span>
                    </div>

                    <div class="field">
                        <label>Дата релиза</label>
                        <input type="date" v-model="formData.release_date">
                    </div>

                    <div class="field checkbox-field">
                        <label class="switch">
                            <input type="checkbox" v-model="formData.public" :value="formData.public">
                            <span class="slider"></span>
                        </label>
                        <span>Нецензурная лексика</span>
                    </div>

                    <div class="field">
                        <label>Текст песни</label>
                        <textarea v-model="formData.lyrics" placeholder="Введите текст песни..."></textarea>
                    </div>
                </div>

                <div class="genres-section">
                    <div class="genres-header">
                        <label>Жанры</label>
                    </div>
                    <div class="genres-buttons">
                        <Button @click.prevent="" v-for="genre in genresData" :key="genre.id">{{ genre.name }}</Button>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary" @click="modalStore.closeModal">Отмена</Button>
                <Button @click="handleSubmit">{{ isEdit ? 'Сохранить' : 'Загрузить' }}</Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .modal-title {
        margin: 0;
        font-size: 1.5rem;
    }

    .create-song-form {
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

    .genres-section{
        display: flex;
        flex-direction: column;
        /* gap: 10px; */
        align-items: baseline;

        .genres-header{
            margin-bottom: 10px;
        }

        .genres-buttons{
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            /* align-items: ; */
            width: 400px;

            button{
                background-color: var(--secondary-color);
                color: white;
                /* border: 1px solid white; */
            }
        }
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

    .field label, .genres-header {
        font-size: 14px;
        font-weight: bold;
        color: #efefef;
    }

    .field input[type='text'], 
    .field input[type='date'],
    .field textarea {
        border-radius: 5px;
        background-color: #d1d1d1;
        border: none;
        padding: 8px;
        width: 100%;
        color: #121212;
    }

    .field textarea {
        height: 100px;
        resize: none;
        font-family: sans-serif;
    }

    /* .row-fields {
        display: flex;
        align-items: flex-end;
        gap: 20px;
    } */

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

    .error{
        color: red;
    }

    .error-input {
        border: 1.5px solid red !important;
    }
</style>