<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import http from '../http';
    import SongsList from '@/components/SongsList.vue';
    import SongCard from '@/components/SongCard.vue';
    import Card from '../components/Card.vue';
    import Image from '../components/Image.vue';
    import Button from '@/components/Input/Button.vue';
    import Play from '@/assets/svg/play.svg?component';
    import router from '../router';
    import { usePlayerStore } from '../stores/player';

    const route = useRoute();
    const playerStore = usePlayerStore();
    const genreId = computed(() => route.params.id);

    const genreName = ref('Загрузка...');
    const popularSongs = ref([]);
    const allSongs = ref([]);
    const isLoading = ref(true);
    const isLoadingMore = ref(false);
    const sortKey = ref('date-desc');

    const currentPage = ref(1);
    const totalPages = ref(1);
    const limit = 20;

    const sortedSongs = computed(() => {
        const songs = [...allSongs.value];
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
    });

    async function fetchGenreData() {
        try {
            isLoading.value = true;
            currentPage.value = 1;

            const [genreRes, popularRes, allRes] = await Promise.all([
                http.get(`/genres/${genreId.value}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                http.get(`/songs/popular?id_genre=${genreId.value}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                }),
                http.get(`/songs?id_genre=${genreId.value}&page=1&limit=${limit}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                })
            ]);

            genreName.value = genreRes.data.data.name;
            popularSongs.value = popularRes.data.data;
            
            allSongs.value = allRes.data.data.songs;
            totalPages.value = allRes.data.data.totalPages;
        } catch (error) {
            console.error('Ошибка при загрузке данных жанра:', error);
        } finally {
            isLoading.value = false;
        }
    }

    async function loadMoreSongs() {
        if (currentPage.value >= totalPages.value || isLoadingMore.value) return;

        try {
            isLoadingMore.value = true;
            const nextPage = currentPage.value + 1;

            const res = await http.get(`/songs?id_genre=${genreId.value}&page=${nextPage}&limit=${limit}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });

            allSongs.value = [...allSongs.value, ...res.data.data.songs];
            currentPage.value = nextPage;
        } catch (error) {
            console.error('Ошибка при дозагрузке треков:', error);
        } finally {
            isLoadingMore.value = false;
        }
    }

    function toSong(songId) { router.push(`/song/${songId}`); }

    function startQueue(songs, startSong = null) {
        playerStore.isShuffled = false;
        playerStore.setQueue([...songs]);
        const songToPlay = startSong || songs[0];
        if (playerStore.currentSong == songToPlay) {
            playerStore.isPlaying ? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong);
        } else { playerStore.playSong(songToPlay); }
    }

    onMounted(fetchGenreData);
    watch(genreId, fetchGenreData);
</script>

<template>
    <div class="home-info">
        <div class="info" v-if="!isLoading">
            
            <div class="section-header main-genre-header">
                <div>
                    <h2>Жанр: {{ genreName }}</h2>
                    <p class="section-subtitle">Погрузитесь в атмосферу направления</p>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div>
                        <h2>Популярно в этом жанре</h2>
                    </div>
                </div>
                <div class="popular-list" v-if="popularSongs.length > 0">
                    <Card @click="toSong(song.id)" v-for="song in popularSongs.slice(0, 12)" :title="song.name" description="Трек" :key="song.id">
                        <template #image><Image :url="song.image"/></template>
                    </Card>
                </div>
                <div class="empty" v-else>Популярных треков пока нет</div>
            </div>

            <div class="section new-section">
                <div class="section-header">
                    <div>
                        <h2>Все треки направления</h2>
                    </div>
                    <div class="list-controls">
                        <label for="sort-select" class="additional-info">Сортировка:</label>
                        <select id="sort-select" v-model="sortKey" class="sort-select">
                            <option value="date-desc">Дата (новые)</option>
                            <option value="date-asc">Дата (старые)</option>
                        </select>
                        <Button @click="startQueue(sortedSongs)" class="play-all-button">
                            <Play color="var(--bg-primary)"/>
                            <span>Слушать всё</span>
                        </Button>
                    </div>
                </div>
                
                <SongsList v-if="sortedSongs.length > 0">
                    <SongCard v-for="(song, index) in sortedSongs" :song="song" :index="index + 1" :key="song.id" />
                </SongsList>
                
                <div class="pagination-container" v-if="currentPage < totalPages">
                    <button class="load-more-btn" @click="loadMoreSongs" :disabled="isLoadingMore">
                        {{ isLoadingMore ? 'Загрузка...' : 'Показать еще' }}
                    </button>
                </div>

                <div class="empty" v-if="sortedSongs.length === 0">В этом жанре треков нет</div>
            </div>

        </div>
        <div class="empty" v-else>Загрузка жанра...</div>
    </div>
</template>

<style scoped>
    .home-info {
        flex-grow: 1;
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .info {
            height: 1vh;
        }

        .main-genre-header {
            padding-top: 30px;
            padding-bottom: 20px;
            margin-bottom: 20px;
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

        .popular-list {
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

        .new-section {
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

    .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px 0 40px 0;
    }

    .load-more-btn {
        background-color: transparent;
        color: var(--text-primary, #fff);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 10px 32px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.1);
            border-color: var(--text-primary);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
</style>