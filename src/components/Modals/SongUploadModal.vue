<script setup>
    import { computed, nextTick, onMounted, reactive, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Input from '@/components/Input/Input.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import router from '@/router/index.js';
    import { helpers, required, maxValue } from '@vuelidate/validators'
    import useVuelidate from '@vuelidate/core'
    import 'cropperjs'
    import ImageCropperModal from '@/components/Modals/ImageCropperModal.vue'
    import { useToastStore } from '../../stores/toast'

    const modalStore = useModalStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()

    const fileInput = ref(null)
    const previewImage = ref(null)
    const isEdit = computed(() => !!modalStore.modalData);

    const currentFileType = ref('image/jpeg')

    const genresData = ref([])

    const isCropping = ref(false)
    const rawImageSrc = ref(null)

    const searchArtistQuery = ref('')
    const foundArtists = ref([])
    const selectedArtists = ref([]) 
    const selectedGenreIds = ref([]) 

    const uploadProgress = ref(null)

    const mustHaveGenre = helpers.withMessage(
        'Выберите хотя бы один жанр', 
        (value) => Array.isArray(value) && value.length > 0
    )

    const rules = {
        name: { required: helpers.withMessage('Поле не может быть пустым', required) },
        song_file: { 
            required: helpers.withMessage(
                'Вы должны загрузить трек', 
                (value) => isEdit.value ? true : !!value
            ) 
        },
        release_date: {
            maxValue: helpers.withMessage(
                'Дата релиза не может быть в будущем',
                (value) => !value || new Date(value) <= new Date()
            )
        },
        genres: { mustHaveGenre }
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

    const validationState = computed(() => ({
        name: formData.name,
        song_file: formData.song_file,
        release_date: formData.release_date,
        genres: selectedGenreIds.value
    }))

    const $v = useVuelidate(rules, validationState)

    function toggleGenre(genreId) {
        const index = selectedGenreIds.value.indexOf(genreId)
        if (index > -1) {
            selectedGenreIds.value.splice(index, 1)
        } else {
            selectedGenreIds.value.push(genreId)
        }
    }

    async function searchArtists() {
        if (!searchArtistQuery.value.trim()) {
            foundArtists.value = []
            return
        }
        try {
            const response = await http.get(`/search?q=${searchArtistQuery.value}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            
            const usersList = response.data.artists || []

            foundArtists.value = usersList.filter(artist => 
                artist.id_user !== userStore.currentUser?.id && 
                !selectedArtists.value.some(selected => selected.id === artist.id)
            )
        } catch (error) {
            console.error('Ошибка при поиске исполнителей:', error)
        }
    }

    function addArtist(artist) {
        selectedArtists.value.push(artist)
        searchArtistQuery.value = ''
        foundArtists.value = []
    }

    function removeArtist(artistId) {
        selectedArtists.value = selectedArtists.value.filter(artist => artist.id !== artistId)
    }

    function onImageChange(e) {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')){
            alert('Пожалуйста, выберите изображение!')
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

    function onAudioChange(e){
        const file = e.target.files[0]
        if (!file || !file.type.startsWith('audio/')) {
            alert('Пожалуйста, выберите аудиофайл!')
            return
        }
        formData.song_file = file
        
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
    }

    function triggerFileInput() {
        if (!isCropping.value) {
            fileInput.value.click()
        }
    }

    async function handleSubmit() {
        const isFormValid = await $v.value.$validate()
        
        if (!isFormValid) {
            toastStore.show('Пожалуйста, исправьте ошибки в форме', 'error')
            return
        }

        const data = new FormData()
        data.append('name', formData.name)
        data.append('release_date', formData.release_date)
        data.append('explicit_content', formData.explicit_content ? 1 : 0)
        data.append('lyrics', formData.lyrics)
        data.append('length', formData.length)

        selectedGenreIds.value.forEach(id => {
            data.append('genres[]', id)
        })

        selectedArtists.value.forEach(artist => {
            data.append('artists[]', artist.id)
        })

        if (formData.image) {
            data.append('image', formData.image)
        }

        if (formData.song_file){
            data.append('song_url', formData.song_file)
        }

        const songId = modalStore.modalData?.id

        try {
            if (isEdit.value){
                await http.patch(`/song/${songId}`, data, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                })
                location.reload()
                toastStore.show('Трек обновлен', 'success')
            } 
            else {
                const response = await http.post('/song', data, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token')},
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        uploadProgress.value = percentage
                    }
                });

                if (response.data?.data?.id){
                    toastStore.show('Трек загружен', 'success')
                    router.push(`/song/${response.data.data.id}`)
                } 
                else {
                    router.push('/')
                }
            }
        } catch (error){
            console.log('Ошибка при загрузке трека ' + error)
            toastStore.show('Ошибка при загрузке трека', 'error')
        }

        uploadProgress.value = null

        modalStore.closeModal()
    }

    async function fetchGenresData(){
        try{
            const genres = await http.get('/genres', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            genresData.value = genres.data.data
        } catch (error){
            console.log('Ошибка при загрузке жанров ' + error)
            toastStore.show('Ошибка при загрузке жанров', 'error')
        }
    }

    onMounted(() => {
        if (modalStore.modalData) {
            previewImage.value = modalStore.modalData.image
            if (modalStore.modalData.genres) {
                selectedGenreIds.value = modalStore.modalData.genres.map(g => g.id)
            }
            if (modalStore.modalData.artists) {
                selectedArtists.value = [...modalStore.modalData.artists]
            }
        }
        fetchGenresData()
        console.log(modalStore.modalData)

    })
</script>

<template>
    <Modal @close="modalStore.closeModal" size="large">
        <template #header>
            <h2 class="modal-title">{{ isEdit ? 'Редактирование' : 'Загрузка' }} трека</h2>
        </template>

        <template #body>
            <form @submit.prevent="handleSubmit" novalidate class="create-song-form">
                <div class="image-upload-container">
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
                </div>

                <div class="inputs-section">
                    <div class="field">
                        <label>Название <span style="color:red;">*</span></label>
                        <input 
                            type="text" 
                            v-model="formData.name" 
                            placeholder="Мой трек" 
                            :class="{ 'error-input': $v.name.$error }"
                            required
                        >
                        <span class="error" v-for="error of $v.name.$errors" :key="error.$uid">{{ error.$message }}</span>
                    </div>

                    <div class="field">
                        <label>Файл трека (.mp3, .wav) <span style="color:red;">*</span></label>
                        <input 
                            type="file" 
                            @change="onAudioChange" 
                            accept="audio/*" 
                            :required="!isEdit"
                        >
                        <span class="error" v-for="error of $v.song_file.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </span>

                        <div v-if="uploadProgress !== null" class="upload-progress-container">
                            <div class="progress-bar-wrapper">
                                <div class="progress-bar-fill" :style="{ width: uploadProgress + '%' }"></div>
                            </div>
                            <span class="progress-text">Загрузка: {{ uploadProgress }}%</span>
                        </div>
                    </div>

                    <div class="field artists-field">
                        <label>Исполнители (Соавторы)</label>
                        <div class="search-wrapper">
                            <input 
                                type="text" 
                                v-model="searchArtistQuery" 
                                @input="searchArtists" 
                                placeholder="Поиск исполнителя..."
                            />
                            <div v-if="foundArtists.length > 0" class="search-dropdown">
                                <div 
                                    v-for="artist in foundArtists" 
                                    :key="artist.id" 
                                    class="search-item" 
                                    @click="addArtist(artist)"
                                >
                                    <img :src="artist.user.avatar" class="search-avatar" />
                                    <span>{{ artist.name }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedArtists.length > 0" class="tags-container">
                            <div v-for="artist in selectedArtists" :key="artist.id" class="artist-tag" @click="removeArtist(artist.id)">
                                <span>{{ artist.name }}</span>
                                <button type="button" class="remove-tag-btn">×</button>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label>Дата релиза</label>
                        <input 
                            type="date" 
                            v-model="formData.release_date"
                            :class="{ 'error-input': $v.release_date.$error }"
                        >
                        <span class="error" v-for="error of $v.release_date.$errors" :key="error.$uid">{{ error.$message }}</span>
                    </div>

                    <div class="field checkbox-field">
                        <label class="switch">
                            <input type="checkbox" v-model="formData.explicit_content" :value="formData.explicit_content">
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
                        <label>Жанры <span style="color:red;">*</span></label>
                    </div>
                    <div class="genres-buttons" :class="{ 'error-genres-container': $v.genres.$error }">
                        <Button 
                            @click.prevent="toggleGenre(genre.id)" 
                            v-for="genre in genresData" 
                            :key="genre.id" 
                            :class="{'active': selectedGenreIds.includes(genre.id)}"
                        >
                            {{ genre.name }}
                        </Button>
                    </div>
                    <span class="error" v-for="error of $v.genres.$errors" :key="error.$uid" style="margin-top: 8px;">
                        {{ error.$message }}
                    </span>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal">Отмена</Button>
                <Button @click="handleSubmit">{{ isEdit ? 'Сохранить' : 'Загрузить' }}</Button>
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

    .create-song-form {
        display: flex;
        gap: 32px;
        padding: 10px 0;
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;
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
        /* width: 400px; */
    }

    .genres-section{
        display: flex;
        flex-direction: column;
        align-items: baseline;
        
    }
    .genres-section .genres-header{
        margin-bottom: 10px;
    }
    .genres-section .genres-buttons{
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        width: 410px;
    }
    .genres-section .genres-buttons button{
        background-color: var(--secondary-color);
        color: white;
    }
    .genres-section .genres-buttons .active{
        background-color: var(--accent-color);
        color: white;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--text-primary);
    }
    .field input[type='text']{
        border-radius: 5px;
        height: 33px;
        font-size: 20px;
        background-color: rgb(217 , 217, 217);
        border: none;
        padding-left: 5px;
        width: 100%;
    }

    .field label, .genres-header {
        font-size: 14px;
        font-weight: bold;
        color: var(--text-primary);
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

    .error{
        color: red;
    }

    .error-input {
        border: 1.5px solid red !important;
    }

    .error-genres-container {
        border: 1px dashed red;
        padding: 8px;
        border-radius: 6px;
    }

    :deep(.cropper-modal.modal-overlay) {
        z-index: 1100;
        background: rgba(0, 0, 0, 0.85);
    }

    .field.artists-field {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .search-wrapper {
        position: relative;
        width: 100%;
    }
    .search-wrapper input[type='text'] {
        border-radius: 5px;
        height: 33px;
        font-size: 16px;
        background-color: rgb(217 , 217, 217);
        border: none;
        padding-left: 5px;
        width: 100%;
        color: black;
    }

    .search-dropdown {
        position: absolute;
        top: calc(100% + 4px); 
        left: 0; 
        right: 0;
        
        background-color: var(--bg-primary);
        border: 1px solid #444;
        border-radius: 5px;
        max-height: 180px;
        overflow-y: auto;
        
        z-index: 999; 
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    .search-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .search-item:hover {
        background-color: var(--bg-hover);
    }

    .search-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
    }

    .tags-container {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 4px;
        min-height: 0;
    }

    .artist-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: var(--accent-color, #5577ee);
        color: white;
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 13px;
        cursor: pointer;
    }

    .remove-tag-btn {
        background: none !important;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .upload-progress-container {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .progress-bar-wrapper {
        width: 100%;
        height: 6px;
        background-color: #333;
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background-color: var(--accent-color, #5577ee);
        width: 0;
        transition: width 0.2s ease-out; 
    }

    .progress-text {
        font-size: 12px;
        color: var(--secondary-text-color, #b3b3b3);
    }
</style>