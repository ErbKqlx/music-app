<script setup>
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'
    import MiscSvg from '@/assets/svg/ThreeDotsVertical.svg?component'
    import Image from '@/components/Image.vue';
    import SvgButton from '@/components/Image.vue';
    import { ref } from 'vue';
    import { Howl } from 'howler';
    import { usePlayerStore } from '../stores/player';

    const props = defineProps({
        song: {

        },
        index: {
            type: Number
        },
    })

    // const highlighted = ref(false)

    const playerStore = usePlayerStore()

    function playSong(){
        if (playerStore.currentSong == props.song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            console.log(playerStore.currentSong)
        }
        else{
            // console.log(11111)
            console.log(props.song)
            playerStore.playSong(props.song)
        }

        // highlighted.value = true
    }
    

    // console.log(props.song)
</script>

<template>
    <div class="song-card" :class="{ active: song.id == playerStore.currentSong?.id }">
        <div class="index additional-info">
            {{ index }}
        </div>
        <div @click="playSong()" class="play-button clickable">
            <!-- <PlaySvg v-if="!playerStore.isPlaying" width="100%" height="100%"/>
            <PauseSvg v-else width="100%" height="100%"/> -->
            <PlaySvg width="100%" height="100%"/>
        </div>
        <div class="image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
            <Image :src="song.image"/>
        </div>
        <div class="song-info">
            <!-- <span class="clickable">{{title}}</span> -->
            <RouterLink :to="'/song/' + song.id" class="clickable">{{ song.name }}</RouterLink>
            <div class="artists">
                <RouterLink :to="'/artist/' + artist.id" v-for="artist in song.artists" :key="artist.id" class="artist-link additional-info clickable">{{ artist.name }}</RouterLink>
            </div>
        </div>
        <div class="album-name">
            <!-- <span class="additional-info clickable">Альбом №1</span> -->
            <RouterLink class="additional-info clickable" to="/album">Альбом №1</RouterLink>
        </div>
        <div class="release-date">
            <span class="additional-info">{{ song.release_date }}</span>
        </div>
        <div class="song-actions">
            <span>{{ Math.trunc(song.length/60) }}:{{ (song.length%60).toString().padStart(2, '0') }}</span>
            <!-- <SvgButton>
                <PlaySvg width="100%" height="100%" viewBox="0 0 15 15"/>
            </SvgButton>
            <SvgButton>
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </SvgButton> -->
            <div class="misc-button clickable">
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </div>
            
            
        </div>
    </div>
</template>

<style scoped>
    .song-card{
        display: flex;
        gap: 10px;
        /* width: 100%; */
        padding: 7px;
        font-size: 14px;
        align-items: center;
        justify-content: space-between;
        border: 2px solid transparent;
        border-radius: 5px;        

        .index{
            width: 20px;
            display: flex;
            justify-content: center;
            align-self: center;
        }

        .image{
            aspect-ratio: 1 / 1;
            width: 45px;
        }

        .song-info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 3px;
            flex-grow: 0.5;
            flex-basis: 25%;

            .artist-link:not(:last-child)::after {
                content: ", ";
            }
        }

        .album-name{
            flex-grow: 1;
        }
        
        .release-date{
            flex-grow: 1;
        }

        .play-button{
            /* background: url(); */
            height: 20px;
            width: 20px;
            /* display: flex;
            justify-content: center;
            align-items: center; */
            /* visibility: hidden; */
            display: none;
            
        }

        .song-actions{
            display: flex;
            align-items: center;
            gap: 10px;

            span{
                font-size: 12px;
            }

            

            .misc-button{
                height: 20px;
                width: 20px;
            }

        }
    }

    .song-card:hover{
        /* background-color: rgb(70, 70, 70); */
        background-color: var(--secondary-color);
        
        .play-button{
            display: block;
        }

        .index{
            display: none;
        }
    }

    .active{
        background-color: var(--secondary-color);
        border: 2px solid #5577ee;
    }
</style>