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
    import Card from '../components/Card.vue';
    import router from '../router';
    import Image from '../components/Image.vue'

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore();
    const userStore = useUserStore()

    const newSongs = ref([])
    const popularSongs = ref([])
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

            const [newSongsRes, popularSongsRes] = await Promise.all([
                http.get('/songs/new', {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                http.get('/songs/popular', {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
            ])
            
            newSongs.value = newSongsRes.data.data
            popularSongs.value = popularSongsRes.data.data
        } catch (error) {
            console.log('Ошибка при загрузке данных главной страницы: ' + error)
        } finally {
            isLoading.value = false
        }
    }

    function startQueue(songs, startSong = null) {
        playerStore.isShuffled = false
        playerStore.setQueue([...songs])
        
        const songToPlay = startSong || songs[0]
        
        if (playerStore.currentSong == songToPlay) {
            playerStore.isPlaying ? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
        } else {
            playerStore.playSong(songToPlay)
        }
    }

    function handleMiscClick(event, songs) {
        const options = [
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue(songs)
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

    function toSong(songId){
        router.push(`/song/${songId}`)
    }

    onMounted(async () => {
        await fetchHomeData()
    })
</script>

<template>
    <div class="home-info">
        <div class="info">
            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Популярные треки за неделю</h2>
                        <p class="section-subtitle">Треки, которые слушают больше всего</p>
                    </div>
                </div>
                
                <div class="popular-list" v-if="popularSongs.length > 0">
                    <Card 
                        @click="toSong(song.id)" 
                        v-for="(song, index) in popularSongs.slice(0, 12)" 
                        :title=song.name 
                        description="Трек" 
                        :key="song.id">

                        <template #image>
                            <Image :url="song.image"/>
                        </template>
                    </Card>
                </div>

                <!-- <SongsList v-if="popularSongs.length > 0">
                    <SongCard 
                        v-for="(song, index) in popularSongs.slice(0, 20)"
                        :song="song"
                        :index="index + 1"
                        :key="song.id"
                    />
                </SongsList> -->
                <div class="empty" v-else>
                    Популярных треков пока нет
                </div>
            </div>
            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Новые релизы</h2>
                        <p class="section-subtitle">Свежие треки, добавленные недавно</p>
                    </div>
                    <div v-if="userStore.currentUser" class="list-controls">
                        <label for="sort-select" class="additional-info">Сортировка:</label>
                        <select id="sort-select" v-model="sortKey" class="sort-select">
                            <option value="date-desc">Дата (сначала новые)</option>
                            <option value="date-asc">Дата (сначала старые)</option>
                            <option value="length-desc">Длительность (по убыванию)</option>
                            <option value="length-asc">Длительность (по возрастанию)</option>
                        </select>
                        <Button @click="startQueue(sortedNewSongs)" class="play-all-button">
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

        .popular-list{
            display: flex;
            padding: 0 10px;
            flex-wrap: wrap;
            justify-content: flex-start;
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