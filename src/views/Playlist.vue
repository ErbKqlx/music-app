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
    import PlaySvg from '@/assets/svg/play.svg?component'
    import PauseSvg from '@/assets/svg/pause.svg?component'


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

        if (isOwner || userStore.isModerator){
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
            type="playlist" 
            :title="playlistData?.data.name"
        >
            <template #image>
                <img :src="playlistData?.data.image" alt="Обложка">
            </template>

            <template #metadata>
                <div class="metadata-row">
                    <div>
                        Кем создан:
                        <RouterLink :to="'/profile/' + playlistData?.data.user.id">
                            {{ playlistData?.data.user.username }}
                        </RouterLink>
                    </div>
                    
                    <span class="separator">•</span>
                    
                    <span>{{ playlistData?.data.songs_count }}</span>
                    <span class="separator">•</span>
                    
                    <span>{{ playlistData?.data.public ? 'Открытый' : 'Закрытый' }}</span>
                    <span class="separator">•</span>
                    <span>Дата создания: {{ formatDate(playlistData?.data.created_at) }}</span>

                </div>
            </template>

            <template #actions>
                <div class="playlist-action-group">
                    <button 
                        class="play-btn" 
                        v-if="sortedSongs.length > 0" 
                        @click="startPlaylist(sortedSongs[0])"
                        :title="playerStore.isPlaying ? 'Пауза' : 'Слушать'"
                    >
                        <span class="play-icon" v-if="playerStore.isPlaying && sortedSongs.some(s => s.id === playerStore.currentSong?.id)">
                            ❚❚
                        </span>
                        <span class="play-icon" v-else>
                            ▶
                        </span>
                    </button>

                    <button class="misc-playlist-btn" @click.stop="handleMiscClick" title="Больше опций">
                        <ThreeDotsHorizontal width="28" height="28"/>
                    </button>
                </div>
            </template>
        </TitleCard>
        <div class="info">
            <div class="list-controls" v-if="sortedSongs.length > 0">
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

    .playlist-action-group {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 8px;
    }

    .play-btn {
        background-color: #5577ee;
        color: white;
        border: none;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s, background-color 0.2s;
        flex-shrink: 0;

        &:hover {
            transform: scale(1.05);
            background-color: #6688ff;
        }

        &:active {
            transform: scale(0.96);
        }

        .play-icon {
            font-size: 14px;
            margin-left: 2px;
            line-height: 1;
        }

        &:has(span:contains("❚❚")) .play-icon {
            margin-left: 0;
            font-size: 16px;
        }
    }

    .misc-playlist-btn {
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border-radius: 50%;
        transition: opacity 0.2s, background-color 0.2s, transform 0.2s;

        :deep(svg) {
            width: 22px !important;
            height: 22px !important;
        }

        &:hover {
            opacity: 1;
        }
        
        &:active {
            transform: scale(0.95);
        }
    }

    .actions {
        margin-top: 16px;
    }

    .metadata-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--text-primary);
        
        .separator {
            opacity: 0.6;
            user-select: none;
        }
    }
</style>