<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import http from '../http'
    import { usePlayerStore } from '../stores/player'
    import SongsList from '@/components/SongsList.vue'
    import SongCard from '@/components/SongCard.vue'
    import Card from '@/components/Card.vue'
    import Image from '@/components/Image.vue'
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import Pause from '@/assets/svg/pause.svg?component'

    const route = useRoute()
    const playerStore = usePlayerStore()

    const artist = ref(null)
    const topSongs = ref([])
    const albums = ref([])
    const isLoading = ref(true)

    const isCurrentArtistPlaying = computed(() => {
        return playerStore.isPlaying && playerStore.currentSong?.artist_id === artist.value?.id
    })

    async function fetchArtistData() {
        try {
            isLoading.value = true
            const artistId = route.params.id

            const [artistRes, songsRes, albumsRes] = await Promise.all([
                http.get(`/artists/${artistId}`),
                http.get(`/artists/${artistId}/top-songs`),
                http.get(`/artists/${artistId}/albums`)
            ])

            artist.value = artistRes.data.data
            topSongs.value = songsRes.data.data
            albums.value = albumsRes.data.data
        } catch (error) {
            console.error('Ошибка при загрузке страницы исполнителя:', error)
        } finally {
            isLoading.value = false
        }
    }

    function handlePlayArtist() {
        if (topSongs.value.length === 0) return

        if (isCurrentArtistPlaying.value) {
            playerStore.pauseSong()
        } else {
            playerStore.setQueue([...topSongs.value])
            playerStore.playSong(topSongs.value[0])
        }
    }

    onMounted(() => {
        fetchArtistData()
    })
</script>

<template>
    <div v-if="isLoading" class="loader-container">
        <div class="loader">Загрузка профиля...</div>
    </div>

    <div v-else-if="artist" class="artist-page">
        <div class="artist-hero" :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), var(--bg-tertiary)), url(${artist.banner || artist.image})` }">
            <div class="hero-content">
                <h1 class="artist-name">{{ artist.name }}</h1>
                <p class="listeners-count" v-if="artist.listeners">
                    {{ artist.listeners.toLocaleString() }} слушателей за месяц
                </p>
            </div>
        </div>

        <div class="artist-actions">
            <Button @click="handlePlayArtist" class="btn-play-artist">
                <component :is="isCurrentArtistPlaying ? Pause : Play" fill="black" />
                <span>{{ isCurrentArtistPlaying ? 'Пауза' : 'Слушать' }}</span>
            </Button>
        </div>

        <div class="artist-body">
            
            <section class="content-section" v-if="topSongs.length > 0">
                <h2>Популярные треки</h2>
                <SongsList>
                    <SongCard 
                        v-for="(song, index) in topSongs.slice(0, 5)" 
                        :key="song.id"
                        :song="song"
                        :index="index + 1"
                    />
                </SongsList>
            </section>

            <section class="content-section" v-if="albums.length > 0">
                <h2>Релизы</h2>
                <div class="albums-grid">
                    <Card 
                        v-for="album in albums" 
                        :key="album.id"
                        :title="album.name"
                        :description="album.release_year ? `${album.release_year} • Альбом` : 'Релиз'"
                        @click="$router.push(`/album/${album.id}`)"
                    >
                        <template #image>
                            <Image :url="album.image"/>
                        </template>
                    </Card>
                </div>
            </section>

            <section class="content-section bio-section" v-if="artist.bio">
                <h2>О себе</h2>
                <div class="bio-card">
                    <p class="bio-text">{{ artist.bio }}</p>
                </div>
            </section>
        </div>
    </div>

    <div v-else class="no-data">
        Исполнитель не найден
    </div>
</template>

<style scoped>
    .loader-container, .no-data {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
        color: var(--text-secondary);
        font-size: 16px;
    }

    .artist-page {
        flex-grow: 1;
        background-color: var(--bg-tertiary, #121214);
        border-radius: 10px;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;
    }

    .artist-hero {
        height: 40vh;
        min-height: 280px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-end;
        padding: 30px 40px;
        position: relative;

        .hero-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 2;

            .verified-badge {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 600;
                color: #3d9bfd;
            }

            .artist-name {
                font-size: clamp(36px, 6vw, 72px);
                font-weight: 900;
                margin: 0;
                color: #fff;
                line-height: 1.1;
                letter-spacing: -2px;
            }

            .listeners-count {
                margin: 0;
                font-size: 14px;
                color: var(--text-secondary, #b3b3b3);
                font-weight: 500;
            }
        }
    }

    .artist-actions {
        padding: 24px 40px 10px 40px;
        display: flex;
        align-items: center;

        .btn-play-artist {
            background-color: var(--text-primary, #fff) !important;
            color: var(--bg-primary, #000) !important;
            border-radius: 30px;
            padding: 12px 32px;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s;

            &:hover {
                transform: scale(1.04);
            }

            svg {
                width: 18px;
                height: 18px;
            }
        }
    }

    .artist-body {
        padding: 10px 40px 40px 40px;
        display: flex;
        flex-direction: column;
        gap: 40px;

        .content-section {
            h2 {
                font-size: 24px;
                font-weight: 800;
                color: var(--text-primary, #fff);
                margin-top: 0;
                margin-bottom: 18px;
            }
        }

        .albums-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .bio-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 24px;
            max-width: 800px;

            .bio-text {
                margin: 0;
                font-size: 15px;
                line-height: 1.6;
                color: var(--text-secondary, #b3b3b3);
                white-space: pre-line;
            }
        }
    }
</style>