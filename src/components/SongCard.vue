<script setup>
    import PlayButton from '@/assets/svg/play.svg?component'
    import MiscButton from '@/assets/svg/ThreeDotsVertical.svg?component'

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
            <span class="clickable">{{title}}</span>
            <span class="additional-info clickable">{{ artists.join(', ') }}</span>
        </div>
        <div class="album-name">
            <span class="additional-info clickable">Альбом №1</span>
        </div>
        <div class="song-actions">
            <span>{{ Math.trunc(length/60) }}:{{ length%60 }}</span>
            <div class="play-button">
                <PlayButton width="100%" height="100%" viewBox="0 0 15 15"/>
            </div>
            <div class="misc-button">
                <MiscButton width="100%" height="100%" viewBox="0 0 16 16"/>
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
        align-items: center;
        justify-content: space-between;

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

        .album-name{
            flex-grow: 1;
        }

        .song-actions{
            display: flex;
            align-items: center;
            gap: 10px;

            span{
                font-size: 12px;
            }

            .play-button{
                /* background: url(); */
                height: 20px;
                width: 20px;
                
            }

            .misc-button{
                height: 20px;
                width: 20px;
            }

            .play-button, .misc-button{
                :hover{
                    cursor: pointer;
                }
            }
        }
    }

    .song-card:hover{
        background-color: rgb(70, 70, 70);
    }
</style>