<script setup>
    import TitleCard from '@/components/TitleCard.vue';
    import Card from '@/components/Card.vue';
    import Image from '@/components/Image.vue';
    import Section from '@/components/Section.vue';
    import SongsList from '@/components/SongsList.vue';
    import SongCard from '@/components/SongCard.vue';
    import Button from '@/components/Input/Button.vue';
    import Play from '@/assets/svg/play.svg?component';
    import router from '@/router/index.js';
    import http from '../http';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useModalStore } from '@/stores/modal'; 
    import Settings from '@/assets/svg/settings.svg?component'
    import { useUserStore } from '../stores/user';
    import { usePlayerStore } from '../stores/player';

    const route = useRoute();
    const modalStore = useModalStore();
    const userStore = useUserStore();
    const playerStore = usePlayerStore();

    const artist = ref(null);
    
    const allSongs = ref([]);
    const isLoadingMore = ref(false);
    const sortKey = ref('date-desc');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const limit = 20;

    const isCurrentArtist = computed(() => userStore.currentUser?.id === artist.value?.id_user)

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

    function toSong(id) {
        router.push('/song/' + id);
    }

    function openBioModal() {
        modalStore.openModal('artistBio', {
            name: artist.value.name,
            bio: artist.value.bio
        });
    }

    function openEditArtistModal() {
        modalStore.openModal('editArtist', {
            id: artist.value.id,
            name: artist.value.name,
            bio: artist.value.bio,
            onSuccess: (updatedData) => {
                if (artist.value) {
                    artist.value.name = updatedData.name;
                    artist.value.bio = updatedData.bio;
                }
            }
        });
    }

    async function fetchArtistData(id) {
        try {
            currentPage.value = 1;
            
            const response = await http.get('/artists/' + id);
            artist.value = response.data.data;

            const songsRes = await http.get(`/songs?id_artist=${id}&page=1&limit=${limit}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });
            
            allSongs.value = songsRes.data.data.songs || [];
            totalPages.value = songsRes.data.data.totalPages || 1;
        }
        catch (error) {
            console.error('Ошибка при загрузке страницы исполнителя: ' + error);
            if (error.response?.status === 404) {
                router.push({ name: 'NotFound' });
            }
        }
    }

    async function loadMoreSongs() {
        if (currentPage.value >= totalPages.value || isLoadingMore.value) return;

        try {
            isLoadingMore.value = true;
            const nextPage = currentPage.value + 1;

            const res = await http.get(`/songs?id_artist=${route.params.id}&page=${nextPage}&limit=${limit}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            });

            allSongs.value = [...allSongs.value, ...res.data.data.songs];
            currentPage.value = nextPage;
        } catch (error) {
            console.error('Ошибка при дозагрузке треков исполнителя:', error);
        } finally {
            isLoadingMore.value = false;
        }
    }

    function startQueue(songs, startSong = null) {
        playerStore.isShuffled = false;
        playerStore.setQueue([...songs]);
        const songToPlay = startSong || songs[0];
        if (playerStore.currentSong == songToPlay) {
            playerStore.isPlaying ? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong);
        } else { playerStore.playSong(songToPlay); }
    }

    onMounted(() => {
        fetchArtistData(route.params.id);
    });

    watch(() => route.params.id, (newId) => {
        fetchArtistData(newId);
    });
</script>

<template>
    <div class="profile-container" v-if="artist">
        <TitleCard 
            type="artist" 
            :title="artist.name"
        >
            <template #image>
                <Image :url="artist.image" :alt="artist.name"/>
            </template>

            <template #metadata>
                <div class="profile-metadata-wrapper">
                    <span class="monthly-listens">
                        {{ artist.monthlyListens?.toLocaleString('ru-RU') || 0 }} слушателей за месяц
                    </span>
                </div>
            </template>

            <template #actions>
                <div class="profile-actions-wrapper">
                    <div class="profile-actions" v-if="isCurrentArtist || userStore.isModerator">
                        <button class="settings-btn" @click="openEditArtistModal" title="Настройки профиля">
                            <Settings width="20" height="20" />
                            <span>Редактировать профиль</span>
                        </button>
                    </div>
                </div>
            </template>
        </TitleCard>

        <div class="profile-content">
            <Section>
                <template #title>Популярные треки</template>
                <template #content>
                    <div class="history-list" v-if="artist.topSongs && artist.topSongs.length > 0">
                        <Card 
                            @click="toSong(song.id)" 
                            v-for="song in artist.topSongs" 
                            :key="song.id"
                            :title="song.name" 
                            :description="`Прослушиваний: ${song.listens_count || 0}`"
                            :explicit-content="song.explicit_content"
                        >
                            <template #image>
                                <Image :url="song.image"/>
                            </template>
                        </Card>
                    </div>
                    <div v-else class="empty-text">
                        У этого исполнителя пока нет популярных треков
                    </div>
                </template>
            </Section>

            <Section v-if="artist.bio">
                <template #title>Биография</template>
                <template #content>
                    <div class="artist-bio-block">
                        <p class="bio-preview-text">{{ artist.bio }}</p>
                        <button @click="openBioModal" class="more-bio-btn">
                            Читать полностью
                        </button>
                    </div>
                </template>
            </Section>

            <Section>
                <template #title>
                    <div class="all-songs-header">
                        <h2>Все треки исполнителя</h2>
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
                </template>
                <template #content>
                    <SongsList v-if="sortedSongs.length > 0">
                        <SongCard v-for="(song, index) in sortedSongs" :song="song" :index="index + 1" :key="song.id" />
                    </SongsList>
                    
                    <div class="pagination-container" v-if="currentPage < totalPages">
                        <button class="load-more-btn" @click="loadMoreSongs" :disabled="isLoadingMore">
                            {{ isLoadingMore ? 'Загрузка...' : 'Показать еще' }}
                        </button>
                    </div>

                    <div class="empty-text" v-if="sortedSongs.length === 0">У этого исполнителя нет треков</div>
                </template>
            </Section>
        </div>
    </div>
</template>

<style scoped>
    .profile-container {
        background-color: var(--bg-tertiary);
        flex-grow: 1;
        overflow-y: auto;
        border-radius: 10px;
        padding-bottom: 24px;

        .profile-content {
            display: flex;
            flex-direction: column;
            gap: 32px;
            padding: 24px;
            height: 1vh;

            & > :first-child {
                margin-top: -40px;
                padding: 20px 24px;
                background: linear-gradient(
                    to bottom,
                    rgba(var(--bg-tertiary-rgb, 18, 18, 20), 0.75) 0%,
                    var(--bg-tertiary, #121214) 100%
                );
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 16px 16px 0 0;
                position: relative;
                z-index: 2;
                box-shadow: 0 -8px 24px rgba(0, 0, 0, var(--shadow-opacity, 0.3));
            }
        }

        .profile-metadata-wrapper {
            display: flex;
            align-items: center;
            color: var(--text-primary);
            font-size: 14px;
            width: 100%;
        }

        .monthly-listens {
            font-weight: 700;
            white-space: nowrap;
        }

        .artist-bio-block {
            background-color: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 8px;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 20px;

            .bio-preview-text {
                color: var(--text-secondary, #b3b3b3);
                font-size: 15px;
                line-height: 1.6;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;  
                overflow: hidden;
            }

            .more-bio-btn {
                background: transparent;
                border: none;
                color: var(--text-primary, #fff);
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                text-decoration: underline;
                opacity: 0.8;
                padding: 0;
                transition: opacity 0.2s;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .profile-actions {
            margin-top: 8px;

            .settings-btn {
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
                border: 1px solid var(--border-hover);
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.2s, transform 0.1s;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                    transform: scale(1.02);
                }

                &:active {
                    transform: scale(0.98);
                }
            }
        }

        .empty-text {
            color: var(--text-secondary);
            font-size: 16px;
            text-align: center;
            padding: 20px 0;
        }

        .history-list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            padding-bottom: 10px;
        }

        .all-songs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            
            h2 {
                margin: 0;
                font-size: 32px;
                color: var(--text-primary);
            }
        }

        .list-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .additional-info {
            font-size: 14px;
            color: var(--text-secondary);
        }

        .sort-select {
            background-color: var(--text-tertiary, #282828);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            outline: none;
            cursor: pointer;

            &:hover {
                background-color: rgb(50, 50, 50);
            }

            option {
                background-color: rgb(30, 30, 30);
                color: white;
            }
        }

        .play-all-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--text-primary, #fff);
            color: var(--bg-primary, #000);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;

            svg {
                width: 16px;
                height: 16px;
            }
        }

        .pagination-container {
            display: flex;
            justify-content: center;
            padding: 20px 0 20px 0;
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
    }
</style>