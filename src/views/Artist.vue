<script setup>
    import TitleCard from '@/components/TitleCard.vue';
    import Card from '@/components/Card.vue';
    import Image from '@/components/Image.vue';
    import Section from '@/components/Section.vue';
    import router from '@/router/index.js';
    import http from '../http';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useModalStore } from '@/stores/modal'; 
    import Settings from '@/assets/svg/settings.svg?component'
    import { useUserStore } from '../stores/user';


    const route = useRoute();
    const artist = ref(null);
    const modalStore = useModalStore();
    const userStore = useUserStore()

    const isCurrentArtist = computed(() => userStore.currentUser?.id === artist.value?.id_user)

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
                    <div v-else class="empty">
                        У этого исполнителя пока нет треков
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
                -webkit-line-clamp: 3;
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