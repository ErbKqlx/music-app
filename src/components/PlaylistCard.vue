<script setup>
    defineProps({
        name: String,
    })
</script>

<template>
    <div class="playlist-card">
        <div class="playlist-image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
        </div>
        <div class="playlist-info">
            <span>{{ name }}</span>
        </div>
    </div>
</template>

<style scoped>
    .playlist-card{
        .playlist-image{
            aspect-ratio: 1 / 1;
            width: 175px;
            background-color: lightgray;
            border-radius: 10px;
            margin-bottom: 10px;
        }
    }

    /* .playlist-card:hover{
        background-color: rgb(70, 70, 70);
    } */
</style>