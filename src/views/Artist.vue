<script setup>
    import TitleCard from '@/components/TitleCard.vue';
    import Card from '@/components/Card.vue';
    import Image from '@/components/Image.vue';
    import Section from '@/components/Section.vue';
    import router from '@/router/index.js';
    import http from '../http';
    import { onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useModalStore } from '@/stores/modal'; 

    const route = useRoute();
    const artist = ref(null);
    const modalStore = useModalStore();

    function toSong(id) {
        router.push('/song/' + id);
    }

    function openBioModal() {
        modalStore.openModal('artistBio', {
            name: artist.value.name,
            bio: artist.value.bio
        });
    }

    async function fetchArtistData(id) {
        try {
            const response = await http.get('/artists/' + id);
            artist.value = response.data.data; 
        }
        catch (error) {
            console.error('Ошибка при загрузке страницы исполнителя: ' + error);
            if (error.response?.status === 404) {
                router.push({ name: 'NotFound' });
            }
        }
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
                <div class="profile-metadata">
                    <span class="bio-text-short">{{ artist.bio || 'Исполнитель' }}</span>
                    <button v-if="artist.bio" @click="openBioModal" class="more-bio-btn">
                        Подробнее
                    </button>
                </div>
            </template>

            <template #actions>
                <div class="profile-actions">
                    <button class="play-btn">Слушать</button>
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
                    <div v-else class="empty">
                        У этого исполнителя пока нет треков
                    </div>
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

        .profile-metadata {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-primary);
            font-size: 14px;
            width: 100%;

            .bio-text-short {
                opacity: 0.8;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 450px;
            }

            .more-bio-btn {
                background: transparent;
                border: none;
                color: var(--text-primary);
                font-weight: 700;
                font-size: 13px;
                cursor: pointer;
                text-decoration: underline;
                opacity: 0.6;
                padding: 0;
                flex-shrink: 0;
                transition: opacity 0.2s;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .profile-actions {
            margin-top: 8px;

            .play-btn {
                background-color: var(--accent-color);
                color: #fff;
                border: none;
                padding: 12px 32px;
                border-radius: 24px;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                transition: transform 0.1s, filter 0.2s;

                &:hover {
                    filter: brightness(1.1);
                    transform: scale(1.03);
                }

                &:active {
                    transform: scale(0.97);
                }
            }
        }

        .empty {
            color: var(--text-secondary);
            font-size: 18px;
            text-align: center;
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .history-list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            padding-bottom: 10px;
        }
    }
</style>