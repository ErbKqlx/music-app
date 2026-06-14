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
    const genres = ref([])
    const selectedGenreId = ref(null)
    const isLoading = ref(true)

    const sortKey = ref('date-desc');

    const filteredPopularSongs = computed(() => {
        if (!selectedGenreId.value) return popularSongs.value;
        return popularSongs.value.filter(song => Number(song.id_genre) === Number(selectedGenreId.value));
    })

    const filteredNewSongs = computed(() => {
        if (!selectedGenreId.value) return newSongs.value;
        return newSongs.value.filter(song => song.id_genre === selectedGenreId.value);
    })

    const sortedNewSongs = computed (() => {
        const songs = [...filteredNewSongs.value];
        
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

            const [newSongsRes, popularSongsRes, genresRes] = await Promise.all([
                http.get('/songs/new', {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                http.get('/songs/popular', {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                http.get('/genres', { 
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                })
            ])
            
            newSongs.value = newSongsRes.data.data
            popularSongs.value = popularSongsRes.data.data
            genres.value = genresRes.data.data
        } catch (error) {
            console.log('Ошибка при загрузке данных главной страницы: ' + error)
        } finally {
            isLoading.value = false
        }
    }

    function selectGenre(genreId) {
        if (genreId === null) {
            selectedGenreId.value = null;
        } else {
            router.push(`/genre/${genreId}`);
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
            
            <div class="section genres-section" v-if="genres.length > 0 && userStore.currentUser">
                <div class="section-header">
                    <div>
                        <h2>Жанры</h2>
                        <p class="section-subtitle">Выберите направление под ваше настроение</p>
                    </div>
                </div>
                
                <div class="genres-list">
                    <button 
                        class="genre-chip" 
                        :class="{ active: selectedGenreId === null }"
                        @click="selectGenre(null)"
                    >
                        Все жанры
                    </button>
                    <button 
                        v-for="genre in genres" 
                        :key="genre.id" 
                        class="genre-chip"
                        :class="{ active: selectedGenreId === genre.id }"
                        @click="selectGenre(genre.id)"
                    >
                        {{ genre.name }}
                    </button>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Популярные треки за неделю</h2>
                        <p class="section-subtitle">Треки, которые слушают больше всего</p>
                    </div>
                </div>
                
                <div class="popular-list" v-if="filteredPopularSongs.length > 0">
                    <Card 
                        @click="toSong(song.id)" 
                        v-for="song in filteredPopularSongs.slice(0, 12)" 
                        :title="song.name" 
                        description="Трек" 
                        :key="song.id"
                        :explicit-content="song.explicit_content"
                        >

                        <template #image>
                            <Image :url="song.image"/>
                        </template>
                    </Card>
                </div>

                <div class="empty" v-else>
                    В этом жанре популярных треков пока нет
                </div>
            </div>

            <div class="section new-section">
                <div class="section-header">
                    <div>
                        <h2>Новые релизы</h2>
                        <p class="section-subtitle">Свежие треки, вышедшие недавно</p>
                    </div>
                    <div v-if="userStore.currentUser" class="list-controls">
                        <label for="sort-select" class="additional-info">Сортировка:</label>
                        <select id="sort-select" v-model="sortKey" class="sort-select">
                            <option value="date-desc">Дата (сначала новые)</option>
                            <option value="date-asc">Дата (сначала старые)</option>
                            <option value="length-desc">Длительность (по убыванию)</option>
                            <option value="length-asc">Длительность (по возрастанию)</option>
                        </select>
                        <Button @click="startQueue(sortedNewSongs.slice(0, 15))" class="play-all-button">
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
                    В этом жанре новых треков пока нет
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

        .genres-section {
            margin-bottom: 30px;

            .section-header{
                padding-bottom: 10px;
            }
        }

        .genres-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 20px;
        }

        .genre-chip {
            background-color: rgba(255, 255, 255, 0.04);
            color: var(--text-secondary, #b3b3b3);
            border: 1px solid rgba(255, 255, 255, 0.02);
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 13.5px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;

            &:hover {
                background-color: rgba(255, 255, 255, 0.09);
                color: var(--text-primary, #fff);
            }

            &:active {
                transform: scale(0.97);
            }

            &.active {
                background-color: var(--text-primary, #fff);
                color: var(--bg-primary, #000);
                border-color: var(--text-primary, #fff);
                box-shadow: 0 4px 12px rgba(255, 255, 255, 0.08);
                font-weight: 700;
                
                &:hover {
                    background-color: var(--text-primary, #fff);
                    color: var(--bg-primary, #000);
                    opacity: 0.95;
                }
            }
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
            gap: 20px;
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

        .new-section{
            padding-bottom: 10px;
        }

        .empty {
            font-size: 20px;
            text-align: center;
            margin-top: 20px;
            color: var(--text-secondary);
            padding: 40px;
        }

        button {
            cursor: pointer;
            transition: opacity 0.2s ease;
        }

        button:hover {
            opacity: 0.9;
        }
    }
</style>