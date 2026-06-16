<script setup>
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'
    import MiscSvg from '@/assets/svg/ThreeDotsVertical.svg?component'
    import Image from '@/components/Image.vue';
    import { usePlayerStore } from '../stores/player';
    import { useContextMenuStore } from '../stores/contextMenu';
    import { formatDate } from '../composables/formatDate';
    import { useUserStore } from '../stores/user';
    import http from '../http';
    import { useToastStore } from '../stores/toast';
    import { useModalStore } from '../stores/modal';
    import { usePlaylistStore } from '../stores/playlist';

    const props = defineProps({
        song: { type: Object, required: true },
        index: { type: Number, required: true },
        playlist: { type: Object }
    })

    const emit = defineEmits(['song-deleted'])

    const playerStore = usePlayerStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()
    const modalStore = useModalStore()
    const playlistStore = usePlaylistStore()

    function playSong(){
        if (playerStore.currentSong?.id === props.song.id){
            playerStore.isPlaying ? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
        } else {
            playerStore.playSong(props.song)
        }
    }

    const contextMenuStore = useContextMenuStore();

    const handleMiscClick = (event) => {
        const isOwner = userStore.currentUser?.id === props.playlist?.user.id;
        const options = []

        if (userStore.isAuthenticated){
            options.push({ 
                label: 'Добавить в плейлист', 
                action: () => modalStore.openModal('selectPlaylists', props.song)
            })
        }

        options.push({ 
            label: 'Добавить в очередь', 
            action: () => playerStore.addToQueue([props.song])
        })

        if (isOwner && userStore.isAuthenticated){
            options.push({
                label: 'Удалить из плейлиста', 
                action: async () => {
                    try {
                        await http.delete(`/playlist/${props.playlist.id}/song/${props.song.id}`, {
                            headers: { Authorization: "Bearer " + localStorage.getItem('token')}
                        })
                        emit('song-deleted', props.song.id)
                        if (userStore.currentUser?.id) {
                            await playlistStore.fetchPlaylists(userStore.currentUser.id)
                        }
                        toastStore.show('Трек удален из плейлиста', 'success')
                    } catch (error){
                        console.error('Ошибка при удалении трека из плейлиста', error)
                        toastStore.show('Ошибка при удалении трека', 'error')
                    }
                }, 
                danger: true 
            })
        }
        contextMenuStore.open(event, options);
    };
</script>

<template>
    <div class="song-card" :class="{ active: song.id === playerStore.currentSong?.id }">
        <div class="index-container">
            <div v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="playing-icon">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <span v-else class="index additional-info" :class="{ 'active-text': song.id === playerStore.currentSong?.id }">
                {{ index }}
            </span>
            
            <div @click="playSong()" class="play-button clickable">
                <PauseSvg v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" width="100%" height="100%"/>
                <PlaySvg v-else width="100%" height="100%"/>
            </div>
        </div>

        <div class="image-wrapper">
            <Image :src="song.image" class="song-img"/>
        </div>

        <div class="song-info">
            <div class="title-container">
                <RouterLink :to="'/song/' + song.id" class="song-title clickable" :class="{ 'active-text': song.id === playerStore.currentSong?.id }">
                    {{ song.name }}
                </RouterLink>
                <span v-if="song.explicit_content" class="explicit-badge" title="Нецензурная лексика">E</span>
            </div>
            <div class="artists">
                <RouterLink 
                    :to="'/artist/' + artist.id" 
                    v-for="artist in song.artists" 
                    :key="artist.id" 
                    class="artist-link additional-info clickable"
                >
                    {{ artist.name }}
                </RouterLink>
            </div>
        </div>

        <div class="release-date">
            <span class="additional-info">{{ formatDate(song.release_date) }}</span>
        </div>

        <div class="duration">
            <span>{{ Math.trunc(song.length / 60) }}:{{ (song.length % 60).toString().padStart(2, '0') }}</span>
        </div>

        <div class="song-actions">
            <div class="misc-button clickable" @click.stop="handleMiscClick">
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .song-card {
        display: grid;
        grid-template-columns: 40px 56px minmax(0, 3fr) minmax(0, 2fr) 70px 40px; 
        gap: 20px;
        padding: 10px 16px;
        font-size: 15px;
        align-items: center;
        border-radius: 8px;
        background-color: transparent;
        transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
    }

    .song-card:hover {
        background-color: var(--bg-hover, rgba(255, 255, 255, 0.08));
    }

    .index-container {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .index {
        display: block;
        font-variant-numeric: tabular-nums;
        font-size: 14px;
    }

    .play-button {
        position: absolute;
        height: 22px;
        width: 22px;
        display: none;
        color: var(--text-primary, #ffffff);
    }

    .song-card:hover {
        .play-button { display: block; }
        .index, .playing-icon { display: none; }
        .misc-button { opacity: 1; pointer-events: all; }
    }

    .playing-icon {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        width: 16px;
        height: 16px;
    }

    .playing-icon .bar {
        width: 3px;
        height: 100%;
        background-color: var(--accent-color, #5577ee);
        border-radius: 1.5px;
        animation: bounce 0.8s ease infinite alternate;
    }
    .playing-icon .bar:nth-child(2) { animation-delay: 0.2s; }
    .playing-icon .bar:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
        0% { height: 25%; }
        100% { height: 100%; }
    }

    .image-wrapper {
        aspect-ratio: 1 / 1;
        width: 56px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: #181818;
    }

    .song-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .song-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        overflow: hidden;
    }

    .title-container {
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 100%;
    }

    .song-title {
        color: var(--text-primary, #ffffff);
        text-decoration: none;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.1s ease;
    }

    .song-title:hover {
        text-decoration: underline;
    }

    .artists {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13.5px;
    }

    .artist-link {
        text-decoration: none;
        transition: color 0.1s ease;
    }

    .artist-link:hover {
        color: var(--text-primary, #ffffff) !important;
        text-decoration: underline;
    }

    .artist-link:not(:last-child)::after {
        content: ", ";
        display: inline-block;
        white-space: pre;
        color: var(--text-secondary, #b3b3b3);
        text-decoration: none !important;
    }

    .additional-info {
        color: var(--text-secondary, #b3b3b3);
    }

    .active-text {
        color: var(--accent-color, #5577ee) !important;
    }

    .explicit-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary, #b3b3b3);
        font-size: 10px;
        font-weight: 700;
        
        height: 16px;
        aspect-ratio: 1 / 1; 
        
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        
        flex-shrink: 0;
        flex-grow: 0;
        
        line-height: 1;
    }

    .release-date {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
    }

    .duration {
        text-align: right;
        font-variant-numeric: tabular-nums;
        color: var(--text-secondary, #b3b3b3);
        font-size: 14.5px;
    }

    .song-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .misc-button {
        height: 22px;
        width: 22px;
        color: var(--text-secondary, #b3b3b3);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, color 0.2s ease;
    }

    .misc-button:hover {
        color: var(--text-primary, #ffffff);
    }

    .active {
        background-color: rgba(85, 119, 238, 0.04);
    }
    
    .active:hover {
        background-color: rgba(85, 119, 238, 0.08);
    }
</style>