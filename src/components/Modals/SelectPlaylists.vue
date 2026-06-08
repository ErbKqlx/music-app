<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import { useToastStore } from '../../stores/toast'

    const modalStore = useModalStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()

    const userPlaylists = ref([])
    const selectedPlaylistIds = ref([])
    
    const isLoading = ref(false)

    const songId = computed(() => modalStore.modalData?.id)

    async function fetchUserPlaylists() {
        isLoading.value = true
        try {
            const response = await http.get(`/users/${userStore.currentUser.id}/playlists`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            
            userPlaylists.value = response.data
        } catch (error) {
            console.error('Ошибка при загрузке плейлистов:', error)
        }
        isLoading.value = false
    }

    async function handleSubmit() {
        if (selectedPlaylistIds.value.length === 0) {
            alert('Выберите хотя бы один плейлист')
            return
        }

        try {
            const requests = selectedPlaylistIds.value.map(playlistId => {
                return http.post(`/playlist/${playlistId}/song/${songId.value}`, {}, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                })
            })

            await Promise.all(requests)

            toastStore.show('Трек добавлен в плейлист(ы)', 'success')
            
            modalStore.closeModal()
        } catch (error) {
            console.error('Ошибка при добавлении трека в плейлисты:', error)
            toastStore.show('Ошибка при добавлении трека в плейлист', 'error')
        }
    }

    onMounted(() => {
        if (userStore.currentUser?.id) {
            fetchUserPlaylists()
        }
    })
</script>

<template>
    <Modal @close="modalStore.closeModal">
        <template #header>
            <h2 class="modal-title">Добавить в плейлист</h2>
            <p class="modal-subtitle" v-if="modalStore.modalData">«{{ modalStore.modalData.name }}»</p>
        </template>

        <template #body>
            <div v-if="isLoading" class="loading">Загрузка плейлистов...</div>
            
            <div v-else-if="userPlaylists.length === 0" class="empty-state">
                У вас еще нет созданных плейлистов.
            </div>
            
            <div v-else class="playlists-list">
                <label 
                    v-for="playlist in userPlaylists.playlists" 
                    :key="playlist.id" 
                    class="playlist-item"
                >
                    <input 
                        type="checkbox" 
                        :value="playlist.id" 
                        v-model="selectedPlaylistIds"
                        class="checkbox"
                    />
                    <span class="playlist-name">{{ playlist.name }}</span>
                </label>
            </div>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary" @click="modalStore.closeModal">Отмена</Button>
                <Button :disabled="selectedPlaylistIds.length === 0" @click="handleSubmit">Сохранить</Button>
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

    .modal-subtitle {
        margin: 4px 0 0 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .playlists-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 4px;
        width: 400px;
    }

    .playlist-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        color: var(--text-primary);
    }

    .playlist-item:hover {
        background-color: var(--bg-hover);
    }

    .checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: #5577ee;
    }

    .playlist-name {
        font-size: 14px;
    }

    .loading, .empty-state {
        text-align: center;
        padding: 20px;
        color: var(--text-secondary);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        width: 100%;
    }
    
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>