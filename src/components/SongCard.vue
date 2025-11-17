<script setup>
    defineProps({
        title: String,
        artists: Array,
        length: String
    })
</script>

<template>
    <div class="song-card">
        <div class="image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
        </div>
        <div class="song-info">
            <span>{{title}}</span>
            <span class="additional-info">{{ artists.join(', ') }}</span>
        </div>
        <div class="song-actions">
            <span>{{ Math.trunc(length/60) }}:{{ length%60 }}</span>
            <div class="play-button">
                
            </div>
            <div class="misc-actions">

            </div>
        </div>
    </div>
</template>

<style scoped>
    .song-card{
        display: flex;
        gap: 10px;
        /* width: 100%; */
        padding: 10px;
        font-size: 14px;

        .image{
            background-color: lightgray;
            width: 45px;
            height: 45px;
            border-radius: 5px;
        }

        .song-info{
            display: flex;
            flex-direction: column;
            align-self: center;
            gap: 3px;
            flex-grow: 1;
        }

        .song-actions{
            display: flex;
            align-self: center;

            span{
                font-size: 12px;
            }

            .play-button{
                background: url();
            }

            .misc-buttons{

            }
        }
    }

    .song-card:hover{
        background-color: rgb(70, 70, 70);
    }
</style>