<script setup>
    import { computed } from 'vue';
    import { usePlayerStore } from '../../stores/player';

    const playerStore = usePlayerStore()

    const handleInput = (event) => {
        const targetTime = parseFloat(event.target.value)
        playerStore.seekTime(targetTime)
    }

    const handleChange = (event) => {
        // const targetTime = parseFloat(event.target.value)
        // playerStore.seekTime(targetTime)
    }

    const sliderStyle = computed(() => {
        // Вычисляем процент заполнения
        const percentage = (playerStore.seek / playerStore.currentSong.length) * 100 || 0;
        
        return {
            background: `linear-gradient(to right, #5577ee ${percentage}%, #4f4f4f ${percentage}%)`
        }
    })
</script>

<template>
    <div class='slider'>
        <input class='range-input' 
            type='range' 
            min='0' 
            :max="playerStore.currentSong.length" 
            :value="playerStore.seek" 
            step='0.1' 
            @input="handleInput" 
            @change="handleChange" 
            :style="sliderStyle">
    </div>
</template>

<style scoped>
    .slider{
        width: 100%;
        display: flex;
    }

    .slider .range-input{
        width: 100%;
        background-color: lightgray;
        border-radius: 20px;
        height: 6px;
        appearance: none;
        align-self: center;
    }

    .slider .range-input:hover{
        cursor: pointer;
    }

    .slider .range-input::-webkit-slider-runnable-track{
        /* background-color: white; */
        border-radius: 10px;
        height: 6px;
    }

    .slider .range-input::-webkit-slider-thumb{
        -webkit-appearance: none;
        background-color: white;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: translateY(-3px);
    }

    .slider .range-input::-webkit-slider-progress{
        background-color: gray;
        border-radius: 10px;
        height: 6px;
    }
</style>