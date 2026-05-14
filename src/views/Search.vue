<script setup>
    import { computed, onMounted, watch } from 'vue';
    import { useSearchStore } from '@/stores/search';
    import { useRoute } from 'vue-router';

    const searchStore = useSearchStore();
    const route = useRoute()

    

    const hasResults = computed(() => {
        // const { songs, artists, users } = searchStore.results;
        const songs = searchStore.results.songs
        const artists = searchStore.results.artists
        const users = searchStore.results.users
        // console.log(songs)
        // console.log(artists)
        // console.log(users)

        return songs.length > 0 || artists.length > 0 || (users && users.length > 0);
    });

    const performSearch = (term) => {
        if (term) {
            searchStore.fetchResults(term);
        }
    };

    watch(() => route.query.q, (newQuery) => {
        performSearch(newQuery);
    });

    onMounted(() => {
        performSearch(route.query.q);
    });
    
</script>

<template>
    <div class="search-info">
        <div class="info">
            <!-- <div v-if="searchStore.isLoading" class="loader">
                <div class="spinner"></div>
                <span>Поиск музыкальных шедевров...</span>
            </div> -->
            <!-- <div v-else-if="hasResults"> -->
            <div v-if="hasResults">
                <section v-if="searchStore.results.songs.length">
                    <h3>Треки</h3>
                    <div v-for="song in searchStore.results.songs" :key="song.id" class="item">
                        <RouterLink :to="'/song/' + song.id">{{ song.name }}</RouterLink>
                    </div>
                </section>

                <section v-if="searchStore.results.artists.length">
                    <h3>Исполнители</h3>
                    <div v-for="artist in searchStore.results.artists" :key="artist.id" class="item">
                        <RouterLink :to="'/artist/' + artist.id">{{ artist.name }}</RouterLink>
                    </div>
                </section>

                <section v-if="searchStore.results.users.length">
                    <h3>Пользователи</h3>
                    <div v-for="user in searchStore.results.users" :key="user.id" class="item">
                        <RouterLink :to="'/profile/' + user.id">{{ user.username }}</RouterLink>
                    </div>
                </section>
            </div>

            <div class="empty" v-else>
                Поиск ничего не нашел...
            </div>
        </div>
    </div>
</template>

<style scoped>
    .search-info{
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--primary-color);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .info{
            height: 1vh;
        }

        .item {
            padding: 10px;
            border-bottom: 1px solid #333;
        }

        .empty{
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
            color: var(--secondary-text-color);
        }

        .loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 30vh;
            gap: 15px;
            color: var(--secondary-text-color);
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #5577ee;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    }
</style>