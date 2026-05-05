<script setup>
import { usePlayerStore } from '@/stores/player';
import Image from '@/components/Image.vue';

const playerStore = usePlayerStore();
</script>

<template>
    <Transition name="slide-side">
        <div v-if="playerStore.isQueueOpen" class="queue-list">
        <div class="queue-header">
            <h2>Очередь</h2>
            <button class="close-btn" @click="playerStore.isQueueOpen = false">✕</button>
        </div>

        <div class="queue-content">
            <div v-if="playerStore.queue.length === 0" class="empty-msg">
                Очередь пуста
            </div>
            
            <div 
                v-for="(song, index) in playerStore.queue" 
                :key="song.id + '-' + index" 
                class="queue-item"
                :class="{ 'is-active': index == playerStore.currentIndex }"
                @click="playerStore.playSong(song)">
                
                <div class="song-img">
                    <Image :src="song.image" />
                </div>
                <div class="song-details">
                    <span class="song-name">{{ song.name }}</span>
                    <span class="song-artist additional-info">{{ song.artists?.map(a => a.name).join(', ') }}</span>
                </div>
            </div>
        </div>
        </div>
    </Transition>
</template>

<style scoped>
    .queue-list {
        overflow-y: scroll;
        position: fixed;
        top: 60px;
        right: 0;
        width: 340px;
        height: calc(100vh - 60px - 80px);
        background-color: var(--primary-color);
        z-index: 10;
        border-radius: 10px;
    }

    .queue-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #282828;
    }

    .queue-header h2 {
        font-size: 18px;
        margin: 0;
        color: var(--primary-text-color);
    }

    .close-btn {
        background: none;
        border: none;
        color: #b3b3b3;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: white;
    }

    .queue-content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
    }

    .queue-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s;
        cursor: pointer;
    }

    .queue-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .queue-item.is-active .song-name {
        color: #5577ee;
    }

    .song-img {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
        border-radius: 4px;
        overflow: hidden;
    }

    .song-details {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .song-name {
        font-size: 14px;
        color: var(--primary-text-color);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .song-artist {
        font-size: 12px;
    }

    .empty-msg {
        text-align: center;
        margin-top: 50px;
        color: #555;
    }

    .slide-side-enter-active,
    .slide-side-leave-active {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .slide-side-enter-from,
    .slide-side-leave-to {
        transform: translateX(100%);
        opacity: 0;
    }
</style>