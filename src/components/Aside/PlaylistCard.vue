<script setup>
    defineProps({
        title: String,
        count: Number
    })
</script>

<template>
    <div class="playlist-card">
        <div class="image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
        </div>
        <div class="playlist-info">
            <span>{{title}}</span>
            <span class="additional-info">{{count}} трек</span>
        </div>
    </div>
</template>

<style scoped>
    .playlist-card{
        display: flex;
        gap: 10px;
        font-size: 14px;
        padding: 7px 5px;

        .image{
            background-color: lightgray;
            width: 40px;
            height: 40px;
            border-radius: 5px;
        }

        .playlist-info{
            display: flex;
            flex-direction: column;
            align-self: center;
            gap: 3px;
            flex-grow: 1;

            :last-child{
                font-size: 12px;
            }
        }
    }
</style>