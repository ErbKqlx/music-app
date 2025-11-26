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
            <span class="additional-info">Исполнитель</span>
        </div>
    </div>
</template>

<style scoped>
    .artist-card{
        padding: 10px 15px;
        border-radius: 5px;

        .artist-image{
            aspect-ratio: 1 / 1;
            width: 10vw;
            background-color: lightgray;
            border-radius: 100%;
            margin-bottom: 10px;
        }

        .artist-info{
            display: flex;
            flex-direction: column;
            gap: 5px;

            .additional-info{
                font-size: 12px;
            }
        }
    }

    .artist-card:hover{
        background-color: rgb(70, 70, 70);
        cursor: pointer;
    }
</style>