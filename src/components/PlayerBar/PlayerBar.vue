<script setup>
    import Image from '@/components/Image.vue';
    import ProgressBar from './ProgressBar.vue';
    import Button from '@/components/Input/Button.vue'

    // SVG
    import RepeatSvg from '@/assets/svg/repeat.svg?component'
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'
    import NextSvg from '@/assets/svg/next.svg?component'
    import PreviousSvg from '@/assets/svg/previous.svg?component'
    import ShuffleSvg from '@/assets/svg/shuffle.svg?component'
    import LyricsSvg from '@/assets/svg/lyrics.svg?component'
    import VolumeSvg from '@/assets/svg/volume.svg?component'

    defineProps({
        songName: {
            type: String,
            default: 'Трек №1',
        },
        artistName: {
            type: String,
            default: 'Исполнитель №1',
        }
    })
</script>

<template>
    <div class="player-bar">
        <div class="song-info">
            <div class="song-preview">
                <Image/>
            </div>
            <div>
                <RouterLink to="/song" class="clickable">{{ songName }}</RouterLink>
                <RouterLink to="/artist" class="additional-info clickable">{{ artistName }}</RouterLink>
            </div>
        </div>
        <div class="main-actions">
            <div class="player-buttons">
                <Button class="no-background round-button">
                    <ShuffleSvg/>
                </Button>
                <Button class="no-background round-button">
                    <PreviousSvg/>
                </Button>
                <Button class="round-button">
                    <PlaySvg/>
                </Button>
                <Button class="no-background round-button">
                    <NextSvg/>
                </Button>
                <Button class="no-background round-button">
                    <RepeatSvg/>
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
            gap: 10px;

            .song-preview{
                aspect-ratio: 1 / 1;
                width: 50px;
            }

            :last-child{
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
            gap: 20px;
        }
    }
</style>