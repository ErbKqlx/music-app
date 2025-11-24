<script setup>
    defineProps({
        name: String,
    })
</script>

<template>
    <div class="artist-card">
        <div class="artist-image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
        </div>
        <div class="artist-info">
            <span>{{ name }}</span>   
        </div>
    </div>
</template>

<style scoped>
    .artist-card{
        .artist-image{
            aspect-ratio: 1 / 1;
            width: 175px;
            background-color: lightgray;
            border-radius: 100%;
            margin-bottom: 10px;
        }
    }
</style>