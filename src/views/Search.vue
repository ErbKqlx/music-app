<script setup>
    import { computed, onMounted, watch } from 'vue';
    import { useSearchStore } from '@/stores/search';
    import { useRoute } from 'vue-router';
    import router from '@/router/index.js'

    const searchStore = useSearchStore();
    const route = useRoute();

    const hasResults = computed(() => {
        const songs = searchStore.results.songs || [];
        const artists = searchStore.results.artists || [];
        const users = searchStore.results.users || [];

        return songs.length > 0 || artists.length > 0 || users.length > 0;
    });

    const performSearch = (term) => {
        if (term) {
            searchStore.fetchResults(term);
        }
    };

    const navigate = (url) => {
        router.push(url)
    }

    watch(() => route.query.q, (newQuery) => {
        performSearch(newQuery);
    });

    onMounted(() => {
        performSearch(route.query.q);
    });
</script>

<template>
    <div class="search-container">
        <div v-if="hasResults" class="search-content">
            <section v-if="searchStore.results.songs?.length" class="search-section">
                <h2 class="section-title">Треки</h2>
                <div class="songs-list">
                    <div v-for="song in searchStore.results.songs" :key="song.id" class="song-item" @click="navigate('/song/' + song.id)">
                        <img :src="song.image" alt="Обложка" class="song-img" />
                        <div class="song-meta">
                            <!-- <RouterLink :to="'/song/' + song.id" class="item-name">{{ song.name }}</RouterLink> -->
                            <span :to="'/song/' + song.id" class="item-name">{{ song.name }}</span>
                            <span class="item-sub additional-info" v-for="artist in song?.artists" :key="artist.id">
                                <!-- {{ song.artists.map(a => a.name).join(', ') }} -->
                                  {{ artist.name }}
                            </span>
                            <span>
                                <!-- {{ song.Artists }} -->
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="searchStore.results.artists?.length" class="search-section">
                <h2 class="section-title">Исполнители</h2>
                <div class="artists-grid">
                    <div v-for="artist in searchStore.results.artists" :key="artist.id" class="grid-card" @click="navigate('/artist/' + artist.id)">
                        <div class="avatar-wrapper artist-avatar">
                            <img :src="artist.image" alt="Исполнитель" />
                        </div>
                        <!-- <RouterLink :to="'/artist/' + artist.id" class="item-name card-name">{{ artist.name }}</RouterLink> -->
                        <span :to="'/artist/' + artist.id" class="item-name card-name">{{ artist.name }}</span>
                        <span class="item-sub">Исполнитель</span>
                    </div>
                </div>
            </section>

            <section v-if="searchStore.results.users?.length" class="search-section">
                <h2 class="section-title">Пользователи</h2>
                <div class="artists-grid">
                    <div v-for="user in searchStore.results.users" :key="user.id" class="grid-card" @click="navigate('/profile/' + user.id)">
                        <div class="avatar-wrapper user-avatar">
                            <img :src="user.image" alt="Пользователь" />
                        </div>
                        <!-- <RouterLink :to="'/profile/' + user.id" class="item-name card-name">{{ user.username }}</RouterLink> -->
                        <span :to="'/profile/' + user.id" class="item-name card-name">{{ user.username }}</span>
                        <span class="item-sub">Профиль</span>
                    </div>
                </div>
            </section>
        </div>

        <div class="empty-state" v-else>
            <!-- <div class="empty-icon">🔍</div> -->
            <h3>Поиск ничего не нашел...</h3>
            <p>Проверьте правильность написания или попробуйте другой запрос.</p>
        </div>
    </div>
</template>

<style scoped>
    .search-container {
        flex-grow: 1;
        /* background-color: var(--primary-color, #121212); */
        border-radius: 10px;
        /* overflow-y: auto; */
        padding: 24px;
        color: #ffffff;

        background-color: var(--bg-tertiary);
        overflow-y: scroll;
    }

    .search-content {
        display: flex;
        flex-direction: column;
        gap: 40px;
        height: 1vh;
    }

    .section-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 16px;
        letter-spacing: -0.5px;
    }

    .songs-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .song-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px 12px;
        border-radius: 6px;
        transition: background-color 0.2s ease;
        cursor: pointer;
    }

    .song-item:hover {
        background-color: rgba(255, 255, 255, 0.08);
    }

    .song-img {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        object-fit: cover;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .song-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .artists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 24px;
    }

    .grid-card {
        background-color: rgba(255, 255, 255, 0.03);
        padding: 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: background-color 0.3s ease, transform 0.2s ease;
        cursor: pointer;
    }

    .grid-card:hover {
        background-color: rgba(255, 255, 255, 0.07);
        transform: translateY(-4px);
    }

    .avatar-wrapper {
        width: 120px;
        height: 120px;
        margin-bottom: 16px;
        overflow: hidden;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }

    .avatar-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .artist-avatar, .user-avatar {
        border-radius: 50%;
    }

    .item-name {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        text-decoration: none;
    }

    /* .item-name:hover {
        text-decoration: underline;
    } */

    .card-name {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
    }

    .item-sub {
        font-size: 13px;
        /* color: var(--secondary-text-color, #b3b3b3); */
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 60px 20px;
        color: var(--secondary-text-color, #b3b3b3);
    }

    /* .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
    } */

    .empty-state h3 {
        font-size: 22px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 8px;
    }

    .empty-state p {
        font-size: 14px;
        max-width: 300px;
        line-height: 1.4;
    }
</style>