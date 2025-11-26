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
            <span class="additional-info">Плейлист</span>
        </div>
    </div>
</template>

<style scoped>
    .playlist-card{
        padding: 10px 15px;
        border-radius: 5px;

        .playlist-image{
            aspect-ratio: 1 / 1;
            width: 10vw;
            background-color: lightgray;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .playlist-info{
            display: flex;
            flex-direction: column;
            gap: 5px;

            .additional-info{
                font-size: 12px;
            }
        }
    }

    .playlist-card:hover{
        background-color: rgb(70, 70, 70);
        cursor: pointer;
    }
</style>