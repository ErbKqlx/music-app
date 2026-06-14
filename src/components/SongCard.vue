<script setup>
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'
    import MiscSvg from '@/assets/svg/ThreeDotsVertical.svg?component'
    import Image from '@/components/Image.vue';
    import SvgButton from '@/components/Image.vue';
    import { ref, reactive } from 'vue';
    import { Howl } from 'howler';
    import { usePlayerStore } from '../stores/player';
    import { useContextMenuStore } from '../stores/contextMenu';
    import { formatDate } from '../composables/formatDate';
    import { useUserStore } from '../stores/user';
    import http from '../http';
    import { useToastStore } from '../stores/toast';
    import { useModalStore } from '../stores/modal';
    import { usePlaylistStore } from '../stores/playlist';


    const props = defineProps({
        song: {
            
        },
        index: {
            type: Number
        },
        playlist: {
            
        }

    })

    const emit = defineEmits(['song-deleted'])

    const playerStore = usePlayerStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()
    const modalStore = useModalStore()
    const playlistStore = usePlaylistStore()

    function playSong(){
        if (playerStore.currentSong == props.song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            console.log(playerStore.currentSong)
        }
        else{
            console.log(props.song)
            playerStore.playSong(props.song)
        }

    }

    const contextMenuStore = useContextMenuStore();

    const handleMiscClick = (event) => {
        const isOwner = userStore.currentUser?.id === props.playlist?.user.id;

        const options = []

        if (userStore.isAuthenticated){
            options.push(
                { 
                    label: 'Добавить в плейлист', 
                    action: () => {
                        modalStore.openModal('selectPlaylists', props.song)
                    }
                },
            )
        }

        options.push(
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue([props.song])
                }
            },
        )

        if (isOwner && userStore.isAuthenticated){
            options.push(
                {
                    label: 'Удалить из плейлиста', 
                    action: async () => {
                        try{
                            await http.delete(`/playlist/${props.playlist.id}/song/${props.song.id}`, 
                                {
                                    headers: { Authorization: "Bearer " + localStorage.getItem('token')}
                                }
                            )

                            emit('song-deleted', props.song.id)

                            if (userStore.currentUser?.id) {
                                await playlistStore.fetchPlaylists(userStore.currentUser.id)
                            }

                            toastStore.show('Трек удален из плейлиста', 'success')
                        }
                        catch (error){
                            console.log('Ошибка при удалении трека из плейлиста ' + error)
                            toastStore.show('Ошибка при удалении трека из плейлиста', 'error')
                        }
                    }, 
                    danger: true 
                },
            )
        }

        
        contextMenuStore.open(event, options);
    };
    

</script>

<template>
    <div class="song-card" :class="{ active: song.id == playerStore.currentSong?.id }">
        <div class="index-container">
            <span class="index additional-info">{{ index }}</span>
            <div @click="playSong()" class="play-button clickable">
                <PauseSvg v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" width="100%" height="100%" color="var(--text-primary)"/>
                <PlaySvg v-else width="100%" height="100%" color="var(--text-primary)"/>
            </div>
        </div>

        <div class="image">
            <Image :src="song.image"/>
        </div>

        <div class="song-info">
            <div class="title-container">
                <RouterLink :to="'/song/' + song.id" class="clickable">{{ song.name }}</RouterLink>
                <span v-if="song.explicit_content" class="explicit-badge" title="Нецензурная лексика">E</span>
            </div>
            <div class="artists">
                <RouterLink :to="'/artist/' + artist.id" v-for="artist in song.artists" :key="artist.id" class="artist-link additional-info clickable">{{ artist.name }}</RouterLink>
            </div>
        </div>

        <div class="release-date">
            <span class="additional-info">{{ formatDate(song.release_date) }}</span>
        </div>

        <div class="duration">
            <span>{{ Math.trunc(song.length/60) }}:{{ (song.length%60).toString().padStart(2, '0') }}</span>
        </div>

        <div class="song-actions">
            <div class="misc-button clickable" @click.stop="handleMiscClick">
                <MiscSvg width="100%" height="100%" viewBox="0 0 16 16"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .song-card{
        display: grid;
        grid-template-columns: 32px 45px minmax(0, 3fr) minmax(0, 2fr) 50px 24px; 
        gap: 16px;
        padding: 8px;
        font-size: 14px;
        align-items: center;
        border: 2px solid transparent;
        border-radius: 6px;

        .index-container {
            width: 100%;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .index{
            display: block;
        }

        .image{
            aspect-ratio: 1 / 1;
            width: 45px;
            overflow: hidden;
        }

        .song-info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            /* flex-grow: 0.5;
            flex-basis: 25%; */
            overflow: hidden;

            .artist-link:not(:last-child)::after {
                content: ", ";
            }
        }

        .title-container {
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .title-container a {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .artists {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .artist-link:not(:last-child)::after {
            content: ", ";
        }

        .explicit-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary, #b3b3b3);
            font-size: 10px;
            font-weight: 700;
            
            height: 16px;
            aspect-ratio: 1 / 1; 
            
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            
            flex-shrink: 0;
            flex-grow: 0;
            
            line-height: 1;
        }
        
        .release-date {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .duration {
            text-align: right;
            /* font-size: 12px; */
            color: var(--text-primary);
        }

        .play-button{
            height: 20px;
            width: 20px;
            display: none;
            
        }

        .song-actions{
            display: flex;
            align-items: center;
            gap: 10px;

            span{
                font-size: 12px;
                color: var(--text-primary);
            }

            .misc-button{
                height: 20px;
                width: 20px;
                color: var(--text-primary);
            }

        }
    }

    .song-card:hover{
        background-color: var(--bg-hover);
        
        .play-button{
            display: block;
        }

        .index{
            display: none;
        }
    }

    .active{
        background-color: var(--bg-hover);
        border: 2px solid #5577ee;
    }
</style>