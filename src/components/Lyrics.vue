<script setup>
    import { useLyricsStore } from '@/stores/lyrics'
    import { ref } from 'vue'
    const lyricsStore = useLyricsStore()
    
</script>

<template>
    <Transition name="lyrics-fade">
        <div v-if="lyricsStore.isOpen" class="lyrics-overlay" @click.self="lyricsStore.closeLyrics()">
            <div class="lyrics-container">
                <div class="lyrics-header">
                    <h2>Текси песни: {{ lyricsStore.songTitle }}</h2>
                    <button class="close-btn" @click="lyricsStore.closeLyrics()">×</button>
                </div>
                <div class="lyrics-scroll-area">
                    <pre>{{ lyricsStore.currentLyrics || 'Текст отсутствует' }}</pre>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
    .lyrics-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .lyrics-container {
        width: 70vw;
        height: 70vh;
        background: var(--primary-color);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        overflow: hidden;
    }

    .lyrics-header {
        padding: 30px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #222;
    }

    .lyrics-header h2 {
        margin: 0;
        font-size: 2rem;
        color: white;
    }

    .lyrics-scroll-area {
        flex-grow: 1;
        padding: 20px 40px 40px;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }

    .lyrics-scroll-area pre {
        white-space: pre-wrap;
        font-size: 1.5rem;
        line-height: 1.8;
        color: #ccc;
        font-family: inherit;
        text-align: center;
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        color: #666;
        font-size: 40px;
        cursor: pointer;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: white;
    }

    .lyrics-scroll-area::-webkit-scrollbar {
        width: 8px;
    }
    .lyrics-scroll-area::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 4px;
    }

    .lyrics-fade-enter-active,
    .lyrics-fade-leave-active {
        transition: all 0.4s ease;
    }

    .lyrics-fade-enter-from,
    .lyrics-fade-leave-to {
        opacity: 0;
    }

    .lyrics-fade-enter-from .lyrics-window {
        transform: scale(0.9) translateY(30px);
        opacity: 0;
    }

    .lyrics-fade-enter-active .lyrics-window {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .lyrics-fade-leave-to .lyrics-window {
        transform: scale(0.95);
        opacity: 0;
    }
</style>