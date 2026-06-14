<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useUserStore } from '@/stores/user'
    import { useToastStore } from '../../stores/toast'
    import { usePlaylistStore } from '../../stores/playlist'

    const modalStore = useModalStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()
    const playlistStore = usePlaylistStore()

    const userPlaylists = computed(() => playlistStore.savedPlaylists)
    const selectedPlaylistIds = ref([])
    
    const isLoading = ref(false)
    const songId = computed(() => modalStore.modalData?.id)

    function isSongAlreadyInPlaylist(playlist) {
        const songs = playlist.Songs || playlist.songs;
        
        if (!songs || !Array.isArray(songs) || !songId.value) return false;
        
        return songs.some(song => song.id === songId.value);
    }

    async function loadPlaylists() {
        if (userStore.currentUser?.id) {
            isLoading.value = true
            try {
                await playlistStore.fetchPlaylists(userStore.currentUser.id)
            } catch (error) {
                console.error('Ошибка при загрузке плейлистов:', error)
            }
            isLoading.value = false
        }
    }

    async function handleSubmit() {
        if (selectedPlaylistIds.value.length === 0) {
            toastStore.show('Выберите хотя бы один плейлист', 'error')
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
            
            selectedPlaylistIds.value = []
            await playlistStore.fetchPlaylists(userStore.currentUser.id)
            modalStore.closeModal()
        } catch (error) {
            console.error('Ошибка при добавлении трека в плейлисты:', error)
            toastStore.show('Ошибка при добавлении трека в плейлист', 'error')
        }
    }

    onMounted(() => {
        loadPlaylists()
    })
</script>

<template>
    <Modal @close="modalStore.closeModal">
        <template #header>
            <div class="modal-header-content">
                <h2 class="modal-title">Добавить в плейлист</h2>
                <p class="modal-subtitle" v-if="modalStore.modalData">
                    Трек: <span>«{{ modalStore.modalData.name }}»</span>
                </p>
            </div>
        </template>

        <template #body>
            <div v-if="isLoading" class="loading-container">
                <div class="spinner"></div>
                <span>Загрузка ваших плейлистов...</span>
            </div>
            
            <div v-else-if="!userPlaylists || !userPlaylists.playlists || userPlaylists.playlists.length === 0" class="empty-state">
                <div class="empty-icon">🎵</div>
                <p>У вас еще нет созданных плейлистов.</p>
            </div>
            
            <div v-else class="playlists-list">
                <label 
                    v-for="playlist in userPlaylists.playlists" 
                    :key="playlist.id" 
                    class="playlist-item"
                    :class="{ 'already-contains': isSongAlreadyInPlaylist(playlist) }"
                >
                    <div class="checkbox-wrapper">
                        <span v-if="isSongAlreadyInPlaylist(playlist)" class="already-added-badge">
                            ✓
                        </span>
                        <input 
                            v-else
                            type="checkbox" 
                            :value="playlist.id" 
                            v-model="selectedPlaylistIds"
                            class="custom-checkbox"
                        />
                    </div>

                    <div class="playlist-cover-container">
                        <img 
                            :src="playlist.image" 
                            alt="Обложка плейлиста" 
                            class="playlist-cover-img"
                        />
                    </div>

                    <div class="playlist-info">
                        <span class="playlist-name">{{ playlist.name }}</span>
                        <span class="tracks-count">
                            {{ playlist.songs_count }}
                            <span v-if="isSongAlreadyInPlaylist(playlist)" class="status-text">— уже добавлен</span>
                        </span>
                    </div>
                </label>
            </div>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal">Отмена</Button>
                <Button :disabled="selectedPlaylistIds.length === 0" @click="handleSubmit" class="primary-btn">
                    Сохранить
                </Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .modal-header-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .modal-title {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.5px;
        color: var(--text-primary);
    }

    .modal-subtitle {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary);
    }
    .modal-subtitle span {
        color: var(--accent-color, #5577ee);
        font-weight: 600;
    }

    .playlists-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 340px;
        overflow-y: auto;
        padding-right: 6px;
        margin: 10px 0;

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
    }

    .playlist-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.03);
        transition: all 0.2s ease;
        user-select: none;
    }

    .playlist-item:hover:not(.already-contains) {
        background-color: var(--bg-hover, rgba(255, 255, 255, 0.08));
        transform: translateX(2px);
    }

    .playlist-item.already-contains {
        cursor: not-allowed;
        opacity: 0.65;
        background-color: rgba(255, 255, 255, 0.01);
    }

    .checkbox-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }

    .custom-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--accent-color, #5577ee);
    }

    .already-added-badge {
        color: var(--accent-color);
        font-weight: 900;
        font-size: 16px;
    }

    .playlist-cover-container {
        width: 44px;
        height: 44px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        flex-shrink: 0;
        display: flex;
    }

    .playlist-cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: #181818;
    }

    .playlist-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-grow: 1;
    }

    .playlist-name {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;
    }

    .tracks-count {
        font-size: 12px;
        color: var(--text-secondary);
    }

    .status-text {
        color: var(--accent-color);
        font-weight: 500;
        margin-left: 4px;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 30px 0;
        color: var(--text-secondary);
        font-size: 14px;
    }

    .spinner {
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--accent-color, #5577ee);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary);
    }

    .empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.5;
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

    .primary-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        background-color: #333 !important;
        border-color: transparent !important;
    }
</style>