<script setup>
    import Header from '@/components/Header.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'
    import SongCard from '@/components/SongCard.vue';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import router from '@/router/index.js';
    import http from '../http';
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '../stores/player';
    import { useContextMenuStore } from '../stores/contextMenu';
    import { formatDate } from '../composables/formatDate';
    import { useUserStore } from '../stores/user';
    import { useModalStore } from '../stores/modal';
    import { useToastStore } from '../stores/toast';
    import { usePlaylistStore } from '../stores/playlist';


    const route = useRoute()

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore();
    const userStore = useUserStore()
    const modalStore = useModalStore()
    const toastStore = useToastStore()
    const playlistStore = usePlaylistStore()

    const playlistData = ref(null)
    const playlistSongs = ref([])

    const sortKey = ref('default');

    const sortedSongs = computed(() => {
        const songs = [...(playlistData.value?.data.songs || [])];
        console.log(songs)

        switch (sortKey.value) {
            case 'date-desc':
                return songs.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            case 'date-asc':
                return songs.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            case 'length-desc':
                return songs.sort((a, b) => b.length - a.length);
            case 'length-asc': 
                return songs.sort((a, b) => a.length - b.length);
            default:
                return songs;
        }
    })


    async function fetchPlaylistData(id){
        try{
            const playlist = await http.get('/playlist/' + id, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })

            playlistData.value = playlist.data
            console.log(playlistData.value)
        }
        catch (error){
            if (error.response.status == 403){
                router.push({name: 'NotFound'})
            }


            if (error.response.status == 404){
                router.push({name: 'NotFound'})
            }

            console.log('Ошибка при загрузке плейлиста ' + error)
            toastStore.show('Ошибка при загрузке плейлиста', 'error')
        }
    }

    

    function startPlaylist(song){
        console.log(playlistData.value?.data.songs)
        playerStore.isShuffled = false
        playerStore.setQueue([...sortedSongs.value])
        
        if (playerStore.currentSong == song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            console.log(playerStore.currentSong)
        }
        else{
            playerStore.playSong(song)
        }
    }

    function handleMiscClick(event){
        const isOwner = userStore.currentUser?.id === playlistData.value?.data.user.id;

        const options = []

        options.push(
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue(sortedSongs.value)
                    // console.log(playerStore.queue)
                }
            },
        )

        if (isOwner){
            options.push(
                { 
                    label: 'Редактировать информацию о плейлисте', 
                    action: () => {
                        modalStore.openModal('playlist', playlistData?.value.data)
                    }
                },
                { 
                    label: 'Удалить плейлист', 
                    action: async () => {
                        try{
                            await http.delete(`/playlist/${playlistData.value?.data.id}`, 
                                {
                                    headers: { Authorization: "Bearer " + localStorage.getItem('token')}
                                }
                            )

                            await playlistStore.fetchPlaylists(userStore.currentUser.id)

                            router.push('/')
                            toastStore.show(`Плейлист (${playlistData.value?.data.name}) удален`, 'success')

                        }
                        catch (error){
                            console.log('Ошибка при удалении плейлиста ' + error)
                            toastStore.show('Ошибка при удалении плейлиста', 'error')

                        }
                    }, 
                    danger: true 
                }
            );
        }
        
        contextMenuStore.open(event, options);
    }

    function removeSongFromList(deletedSongId){
        playlistData.value.data.songs = playlistData.value.data.songs.filter(
            song => song.id !== deletedSongId
        )
    }

    watch(() => route.params.id, (newId) => {
        fetchPlaylistData(newId);
    });

    onMounted(async () => {
        fetchPlaylistData(route.params.id)
    })
</script>

<template>
    <div class="playlist-info">
        <TitleCard 
            :title="playlistData?.data.name" 
            :id_user="playlistData?.data.user.id"
            :username="playlistData?.data.user.username" 
            :created_at="formatDate(playlistData?.data.created_at)" >
            <template #image>
                <Image :url="playlistData?.data.image"/>
            </template>
            <template #actions>
                <Button @click="startPlaylist(sortedSongs[0])" class="play-button round-button"><Play color="var(--bg-primary)"/></Button>
                <Button @click.stop="handleMiscClick" class="no-background round-button"><ThreeDotsHorizontal color="var(--text-primary)"/></Button>
            </template>
        </TitleCard>
        <div class="info">
            <div class="list-controls">
                <label for="sort-select" class="additional-info">Сортировка:</label>
                <select id="sort-select" v-model="sortKey" class="sort-select">
                    <option value="default">По умолчанию</option>
                    <option value="date-desc">Дата (сначала новые)</option>
                    <option value="date-asc">Дата (сначала старые)</option>
                    <option value="length-desc">Длительность (по убыванию)</option>
                    <option value="length-asc">Длительность (по возрастанию)</option>
                </select>
            </div>
            <SongsList v-if="sortedSongs.length > 0">
                <SongCard v-for="(song, index) in sortedSongs"
                    :song="song"
                    :playlist="playlistData?.data"
                    :index="index + 1"
                    @song-deleted="removeSongFromList"

                    :key="song.id"
                />
            </SongsList>
            <div class="empty" v-else>
                В этом плейлисте нет треков
            </div>
        </div>
    </div>
</template>

<style scoped>
    .playlist-info{
        flex-grow: 1;
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .info{
            height: 1vh;
        }

        button{
            background-color: var(--text-primary);
        }
        
        .list-controls {
            padding-left: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 10px;
        }

        .sort-select {
            background-color: var(--text-tertiary);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            outline: none;
            cursor: pointer;
        }

        .sort-select:hover {
            background-color: rgb(50, 50, 50);
        }

        .sort-select option {
            background-color: rgb(30, 30, 30);
            color: white;
        }

        .empty{
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
            color: var(--text-secondary);
        }
    }
</style>