<script setup>
    import Slider from '@/components/Input/Slider.vue';
</script>

<template>
    <div class="progress-bar">
        <span>0:00</span>
        <Slider/>
        <span>3:40</span>
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