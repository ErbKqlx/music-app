<script setup>
    import Image from '@/components/Image.vue';
    import ProgressBar from './ProgressBar.vue';
    import Button from '@/components/Input/Button.vue'
    import { usePlayerStore } from '@/stores/player';
    import { onMounted, ref } from 'vue';
    import { watch } from 'vue';

    // SVG
    import RepeatSvg from '@/assets/svg/repeat.svg?component'
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'
    import NextSvg from '@/assets/svg/next.svg?component'
    import PreviousSvg from '@/assets/svg/previous.svg?component'
    import ShuffleSvg from '@/assets/svg/shuffle.svg?component'
    import LyricsSvg from '@/assets/svg/lyrics.svg?component'
    import VolumeSvg from '@/assets/svg/volume.svg?component'
    

    const playerStore = usePlayerStore()

    // defineProps({
    //     song_name: {
    //         type: String,
    //         default: 'Трек №1',
    //     },
    //     artists: {
    //         type: String,
    //         default: 'Исполнитель №1',
    //     }
    // })

    const song = ref(null)

    function setSongData(songData){
        song.value = songData
    }

    // const songStore = useSongStore()


    watch(() => playerStore.currentSong, (newCurrent) => {
        setSongData(newCurrent);
        // console.log(song)
    },
    {
        deep: true
    });

    onMounted(() => {
        setSongData(playerStore.currentSong)
    })
</script>

<template>
    <div class="player-bar">
        <div class="song-info" v-if="song">
            <div class="song-preview">
                <Image :src="song?.image"/>
            </div>
            <div class="song">
                <!-- <RouterLink to="/song" class="clickable">{{ songStore.currentSong.name }}</RouterLink> -->
                <RouterLink :to="'/song/' + song?.id" class="clickable">{{ song?.name }}</RouterLink>
                <!-- <RouterLink to="/artist" class="additional-info clickable">{{ songStore.currentSong.artistName }}</RouterLink> -->
                <div class="artists">
                    <RouterLink :to="'/artist/' + artist.id" v-for="artist in song?.artists" :key="artist.id" class="artist-link additional-info clickable">{{ artist.name }}</RouterLink>
                </div>
            </div>
        </div>
        <div class="song-info" v-else>
            Выберите трек
        </div>
        <div class="main-actions">
            <div class="player-buttons">
                <Button class="no-background round-button">
                    <ShuffleSvg/>
                </Button>
                <Button class="no-background round-button">
                    <PreviousSvg/>
                </Button>
                <Button @click="playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)" class="round-button">
                    <PlaySvg v-if="!playerStore.isPlaying"/>
                    <PauseSvg v-else/>
                </Button>
                <Button class="no-background round-button">
                    <NextSvg/>
                </Button>
                <Button @click="playerStore.setRepeat(playerStore.onRepeat)" class="no-background round-button">
                    <RepeatSvg :color="playerStore.onRepeat? '#5577ee' : 'var(--secondary-text-color)'"/>
                </Button>
            </div>
            <ProgressBar/>
        </div>
        <div class="misc-buttons">
            <Button class="no-background round-button">
                <LyricsSvg/>
            </Button>
            <Button class="no-background round-button">
                <VolumeSvg/>
            </Button>
        </div>
    </div>
</template>

<style scoped>
    .player-bar{
        background-color: black;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* margin-top: auto; */
        padding: 20px;

        .song-info{
            display: flex;
            max-width: 25%;
            flex-grow: 1;
            gap: 10px;

            .artist-link:not(:last-child)::after {
                content: ", ";
            }

            .song-preview{
                aspect-ratio: 1 / 1;
                width: 50px;
            }

            .song{
                display: flex;
                flex-direction: column;
                /*justify-content: space-around;*/
                font-size: 14px;
                align-self: center;
                gap: 5px;
            }

            :last-child .additional-info{
                font-size: 12px;
            }
        }

        .main-actions{
            display: flex;
            flex-direction: column;
            width: 50%;
            align-items: center;
            /* justify-content: center; */
            gap: 10px;

            .player-buttons{
                display: flex;
                gap: 15px;
                align-items: center;

                .button{
                    background-color: lightgray;
                    width: 38px;
                    height: 38px;
                    border-radius: 360px;
                    color: black;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .button:hover{
                    cursor: pointer;
                }
            }
        }

        .misc-buttons{
            display: flex;
            align-items: center;
            justify-content: end;
            flex-grow: 1;
            /* min-width: 25%; */
            gap: 20px;
        }
    }
</style>