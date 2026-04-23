<script setup>
    import Slider from '@/components/Input/Slider.vue';
    import { usePlayerStore } from '../../stores/player';

    const playerStore = usePlayerStore()

    function formatTime(length){
        const min = Math.floor(length / 60)
        const sec = Math.floor(length % 60)

        return `${min}:${sec.toString().padStart(2, '0')}`
    }
</script>

<template>
    <div class="progress-bar">
        <span>{{ formatTime(playerStore.seek) }}</span>
        <Slider/>
        <span>{{ formatTime(playerStore.currentSong.length) }}</span>
    </div>
</template>

<style scoped>
    .progress-bar{
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        width: 100%;
    }
</style>