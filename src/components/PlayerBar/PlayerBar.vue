<script setup>
    import Image from '@/components/Image.vue';
    import ProgressBar from './ProgressBar.vue';
    import Button from '@/components/Input/Button.vue'
    import { usePlayerStore } from '@/stores/player';
    import { useLyricsStore } from '@/stores/lyrics';
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
    import VolumeMutedSvg from '@/assets/svg/volume_muted.svg?component'
    import QueueSvg from '@/assets/svg/queue.svg?component'
    import QueueList from '../QueueList.vue';

    

    const playerStore = usePlayerStore()
    const lyricsStore = useLyricsStore()

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
    const isVolumeHovered = ref(false);

    function setSongData(songData){
        song.value = songData
    }

    // const songStore = useSongStore()

    function playPrevSong(){
        playerStore.playPrev()
    }

    function playNextSong(){
        playerStore.playNext()
    }

    function handleLyricsClick() {
        // lyricsStore.toggleLyrics()
        if (!lyricsStore.isOpen){
            lyricsStore.openLyrics(playerStore.currentSong.lyrics, playerStore.currentSong.artists, playerStore.currentSong.name)
        }
        else{
            lyricsStore.closeLyrics()
        }
        
    }

    // function toggleQueue() {
    //     playerStore.toggleQueue();
    // }

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
                <Button @click="playerStore.toggleShuffle()" class="no-background round-button">
                    <ShuffleSvg :color="playerStore.isShuffled? '#5577ee' : 'var(--text-primary)'"/>
                </Button>
                <Button @click="playPrevSong()" class="no-background round-button">
                    <PreviousSvg color='var(--text-primary)'/>
                </Button>
                <Button @click="playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)" class="round-button">
                    <PlaySvg v-if="!playerStore.isPlaying"/>
                    <PauseSvg v-else/>
                </Button>
                <Button @click="playNextSong()" class="no-background round-button">
                    <NextSvg color='var(--text-primary)'/>
                </Button>
                <Button @click="playerStore.setRepeat(playerStore.onRepeat)" class="no-background round-button">
                    <RepeatSvg :color="playerStore.onRepeat? '#5577ee' : 'var(--text-primary)'"/>
                </Button>
            </div>
            <ProgressBar/>
        </div>
        <div class="misc-buttons">
            <Button @click="playerStore.toggleQueue()" class="no-background round-button">
                <QueueSvg :color="playerStore.isQueueOpen ? '#5577ee' : 'var(--text-primary)'"></QueueSvg>
            </Button>
            <!-- <QueueList /> -->
            <Button @click="handleLyricsClick" class="no-background round-button">
                <LyricsSvg :color="lyricsStore.isOpen? '#5577ee' : 'var(--text-primary)'"/>
            </Button>
            <div class="volume-container" @mouseenter="isVolumeHovered = true" @mouseleave="isVolumeHovered = false">
                <transition name="fade">
                    <div v-show="isVolumeHovered" class="volume-popover">
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            :value="playerStore.volume"
                            @input="playerStore.setVolume($event.target.value)"
                            class="volume-slider"
                        />
                    </div>
                </transition>

                <Button @click="playerStore.volume != 0 ? playerStore.setVolume(0) : playerStore.setVolume(0.5)" class="no-background round-button">
                    <VolumeSvg color='var(--text-primary)' v-if="playerStore.volume > 0"/>
                    <VolumeMutedSvg color='var(--text-primary)' v-else/>
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .player-bar{
        /* background-color: black; */
        background-color: var(--bg-primary);
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
            color: var(--text-primary);

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

            :last-child :not(.additional-info){
                color: var(--accent-color);
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
            color: var(--text-primary);

            .player-buttons{
                display: flex;
                gap: 15px;
                align-items: center;

                button{
                    background-color: var(--text-primary);
                    /* background-color: var(--); */
                    width: 38px;
                    height: 38px;
                    border-radius: 360px;
                    /* color: black; */
                    color: var(--bg-primary);

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

            .volume-container {
                position: relative;
                display: flex;
                align-items: center;
                height: 100%;
                z-index: 999;
            }

            .volume-popover {
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                /* background-color: #282828; */
                background-color: var(--bg-tertiary);
                padding: 12px 15px;
                border-radius: 8px;
                box-shadow: var(--shadow-sm);
                display: flex;
                justify-content: center;
                align-items: center;
                /* border: 1px solid black; */
                border: 1px solid var(--border-hover);
            }

            .volume-slider {
                appearance: none;
                -webkit-appearance: none;
                width: 6px;
                height: 100px;
                /* background: #4d4d4d; */
                border-radius: 2px;
                outline: none;
                appearance: slider-vertical;
                cursor: pointer;
            }

            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
            }

            .fade-enter-active, .fade-leave-active {
                transition: opacity 0.2s, transform 0.2s;
            }
            .fade-enter-from, .fade-leave-to {
                opacity: 0;
                transform: translateX(-50%) translateY(10px);
            }
        }
    }


    
</style>