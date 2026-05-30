<script setup>
    import Header from '@/components/Header.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import SongCard from '@/components/SongCard.vue';
    import Carousel from '@/components/Carousel.vue'
    import { computed, onMounted, ref } from 'vue';
    import http from '../http';
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import { usePlayerStore } from '../stores/player';
    import { useContextMenuStore } from '../stores/contextMenu';
    import { formatDate } from '../composables/formatDate';
    import { useUserStore } from '../stores/user';

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore();
    const userStore = useUserStore()

    const newSongs = ref([])
    const popularTracks = ref([])
    const featuredPlaylists = ref([])
    const isLoading = ref(true)

    const sortKey = ref('date-desc');

    const sortedNewSongs = computed (() => {
        const songs = [...newSongs.value];
        
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

    async function fetchHomeData() {
        try {
            isLoading.value = true

            // const newTracksRes = await http.get('/songs/new', {
            //     headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            // })
            const [newSongsRes, popularTracksRes, featuredPlaylistsRes] = await Promise.all([
                http.get('/songs/new', {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                // http.get('/tracks/popular', {
                //     headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                // }),
                // http.get('/playlists/featured', {
                //     headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                // })
            ])
            
            newSongs.value = newSongsRes.data.data
            console.log(newSongs.value)
            popularTracks.value = popularTracksRes.data
            featuredPlaylists.value = featuredPlaylistsRes.data
        } catch (error) {
            console.log('Ошибка при загрузке данных главной страницы: ' + error)
        } finally {
            isLoading.value = false
        }
    }

    function startPlaylist(songs, startSong = null) {
        playerStore.isShuffled = false
        playerStore.setQueue([...songs])
        
        const songToPlay = startSong || songs[0]
        
        if (playerStore.currentSong == songToPlay) {
            playerStore.isPlaying ? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
        } else {
            playerStore.playSong(songToPlay)
        }
    }

    function handleMiscClick(event, tracks) {
        const options = [
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue(tracks)
                }
            },
            { 
                label: 'Добавить в плейлист', 
                action: () => {
                    console.log("Добавить в плейлист")
                }
            }
        ]

        contextMenuStore.open(event, options);
    }

    onMounted(async () => {
        await fetchHomeData()
    })
</script>

<template>
    <div class="home-info">
        <!-- <div v-if="!isLoading && newTracks.length > 0" class="carousel-section">
            <Carousel 
                :items="newTracks" 
                :auto-play="true"
                :interval="4000"
                @play-track="handlePlayTrack"
            />
        </div> -->

        <div class="info">
            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Новые релизы</h2>
                        <p class="section-subtitle">Свежие треки, добавленные недавно</p>
                    </div>
                    <div class="list-controls">
                        <label for="sort-select" class="additional-info">Сортировка:</label>
                        <select id="sort-select" v-model="sortKey" class="sort-select">
                            <option value="date-desc">Дата (сначала новые)</option>
                            <option value="date-asc">Дата (сначала старые)</option>
                            <option value="length-desc">Длительность (по убыванию)</option>
                            <option value="length-asc">Длительность (по возрастанию)</option>
                        </select>
                        <Button @click="startPlaylist(sortedNewTracks)" class="play-all-button">
                            <Play color="var(--bg-primary)"/>
                            <span>Слушать всё</span>
                        </Button>
                    </div>
                </div>
                
                <SongsList v-if="sortedNewSongs.length > 0">
                    <SongCard 
                        v-for="(song, index) in sortedNewSongs.slice(0, 15)"
                        :song="song"
                        :index="index + 1"
                        :key="song.id"
                    />
                </SongsList>
                <div class="empty" v-else>
                    Новых треков пока нет
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Популярное сейчас</h2>
                        <p class="section-subtitle">Треки, которые слушают больше всего</p>
                    </div>
                    <Button @click="startPlaylist(popularTracks)" class="play-all-button">
                        <Play color="var(--bg-primary)"/>
                        <span>Слушать всё</span>
                    </Button>
                </div>
                
                <SongsList v-if="popularTracks.length > 0">
                    <SongCard 
                        v-for="(song, index) in popularTracks.slice(0, 20)"
                        :song="song"
                        :index="index + 1"
                        :key="song.id"
                    />
                </SongsList>
                <div class="empty" v-else>
                    Популярных треков пока нет
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .home-info{
        flex-grow: 1;
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .info{
            height: 1vh;
        }

        .section {
            margin-bottom: 40px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 20px 20px 0 20px;
            margin-bottom: 10px;
        }

        .section-header h2 {
            font-size: 28px;
            margin: 0 0 8px 0;
            color: var(--text-primary);
        }

        .section-subtitle {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .list-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .sort-select {
            background-color: var(--text-tertiary);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 8px 12px;
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

        .play-all-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--text-primary);
            color: var(--bg-primary);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
        }

        .play-all-button svg {
            width: 16px;
            height: 16px;
        }

        .round-button {
            background-color: var(--text-primary);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .no-background {
            background: transparent;
            border: none;
        }

        .carousel-section {
            padding: 20px;
            margin-bottom: 0;
        }

        .carousel-item {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .carousel-item:hover {
            transform: scale(1.02);
        }

        .carousel-image {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            overflow: hidden;
        }

        .carousel-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .carousel-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
        }

        .carousel-info h3 {
            margin: 0 0 5px 0;
            font-size: 20px;
        }

        .carousel-info p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .playlist-author {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 5px;
        }

        .empty {
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
            color: var(--text-secondary);
            padding: 40px;
        }

        button {
            cursor: pointer;
            transition: opacity 0.2s ease;
        }

        button:hover {
            opacity: 0.8;
        }
    }
</style>