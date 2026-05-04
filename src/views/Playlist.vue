<script setup>
    import Header from '@/components/Header.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'
    import SongCard from '@/components/SongCard.vue';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import router from '@/router/index.js';
    import http from '../http';
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '../stores/player';
    import { useContextMenuStore } from '../stores/contextMenu';
    import { formatDate } from '../composables/formatDate';


    const route = useRoute()

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore();

    const playlistData = ref(null)
    const playlistSongs = ref([])

    // Типы: 'default', 'date', 'length'
    // const sortType = ref('default'); 
    // const sortOrder = ref('asc');

    // function toggleSort(type) {
    //     if (sortType.value === type) {
    //         sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    //     } else {
    //         sortType.value = type;
    //         sortOrder.value = 'desc'; // По умолчанию новые/длинные сверху
    //     }
    // }

    const sortKey = ref('default');

    const sortedSongs = computed(() => {
        const songs = [...(playlistData.value?.data.songs || [])];

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
            // console.log(playlist.data)

            playlistData.value = playlist.data

            // const songs = await http.get(`/playlist/${id}/songs`, {
            //     headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            // })
            // playlistSongs.value = songs.data
            console.log(playlistData.value)
            // console.log(playlistData.value)
            // console.log(userData.value)
        }
        catch (error){
            // if (error.response.status == 401){
            //     router.push('/')
            // }
            if (error.response.status == 403){
                router.push({name: 'NotFound'})
            }


            if (error.response.status == 404){
                router.push({name: 'NotFound'})
            }

            console.log('Ошибка при загрузке плейлиста ' + error)
        }
    }

    

    function startPlaylist(song){
        playerStore.isShuffled = false
        playerStore.setQueue(sortedSongs.value)
        
        if (playerStore.currentSong == song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            console.log(playerStore.currentSong)
        }
        else{
            playerStore.playSong(song)
        }
    }

    function handleMiscClick(event){
        // console.log(event)
        const options = [
            { 
                label: 'Редактировать информацию о плейлисте', 
                action: () => {
                    console.log("Редактировать информацию о плейлисте") 
                }
            },
            { 
                label: 'Сделать открытым', 
                action: () => {
                    console.log("Сделать открытым") 
                }
            },
            { 
                label: 'Удалить плейлист', 
                action: () => console.log("Удалить плейлист"), 
                danger: true 
            }
        ];
        contextMenuStore.open(event, options);
    }

    onMounted(async () => {
        fetchPlaylistData(route.params.id)
    })
</script>

<template>
    <Header></Header>
    <Wrapper>
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
                    <Button @click="startPlaylist(sortedSongs[0])" class="play-button round-button"><Play/></Button>
                    <Button @click.stop="handleMiscClick" class="no-background round-button"><ThreeDotsHorizontal/></Button>
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
                <SongsList v-if="playlistData?.data.songs.length > 0">
                    <SongCard v-for="(song, index) in sortedSongs"
                        :song="song"
                        :index="index + 1"

                        :key="song.id"
                    />
                </SongsList>
                <div class="empty" v-else>
                    В этом плейлисте нет треков
                </div>
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>
    <PlayerBar/>
</template>

<style scoped>
    .playlist-info{
        height: 1vh;
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--primary-color);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;
        
        .list-controls {
            padding-left: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 10px;
        }

        .sort-select {
            background-color: var(--secondary-color);
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
        }
    }
</style>