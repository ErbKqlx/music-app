<script setup>
    import PlaySvg from '@/assets/svg/play.svg?component'
    import MiscSvg from '@/assets/svg/ThreeDotsVertical.svg?component'
    import Image from '@/components/Image.vue';
    import SvgButton from '@/components/Image.vue';

    defineProps({
        title: {
            type: String,
            default: '',
        },
        artists: {
            type: Array,
            default: null,
        },
        length: {
            type: String,
            default: '',
        },
    })
</script>

<template>
    <div class="song-card">
        <div class="image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
            <Image/>
        </div>
        <div class="song-info">
            <!-- <span class="clickable">{{title}}</span> -->
            <RouterLink to="/song" class="clickable">{{ title }}</RouterLink>
            <span class="additional-info clickable">{{ artists.join(', ') }}</span>
        </div>
        <div class="album-name">
            <!-- <span class="additional-info clickable">Альбом №1</span> -->
            <RouterLink class="additional-info clickable" to="/album">Альбом №1</RouterLink>
        </div>
        <div class="song-actions">
            <span>{{ Math.trunc(length/60) }}:{{ length%60 }}</span>
            <!-- <SvgButton>
                <PlaySvg width="100%" height="100%" viewBox="0 0 15 15"/>
            </SvgButton>
            <SvgButton>
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </SvgButton> -->
            
            <!-- <div class="play-button">
                <PlaySvg width="100%" height="100%" viewBox="0 0 15 15"/>
            </div> -->
            <!-- <div class="misc-button">
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </div> -->
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
        border-radius: 5px;

        .image{
            aspect-ratio: 1 / 1;
            width: 45px;
        }

        .song-info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
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
        /* background-color: rgb(70, 70, 70); */
        background-color: var(--secondary-color);
    }
</style>