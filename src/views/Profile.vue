<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
    import ArtistCard from '@/components/ArtistCard.vue';
    import CardsList from '@/components/CardsList.vue';
    import router from '@/router/index.js';
    import Image from '@/components/Image.vue';
    import Card from '@/components/Card.vue';
    import Wrapper from '@/components/Wrapper.vue';
    import { onMounted, ref, watch, computed } from 'vue';
    import http from '../http';
    import { useRoute } from 'vue-router';
    import Button from '@/components/Input/Button.vue'
    import Settings from '@/assets/svg/settings.svg?component'
    import Section from '@/components/Section.vue';
    import { useUserStore } from '../stores/user';
    import { useModalStore } from '../stores/modal';

    const route = useRoute()
    const userStore = useUserStore()
    const modalStore = useModalStore()

    const userData = ref(null)
    const songsData = ref(null)
    const savedPlaylists = ref([])
    const playlistCount = ref(0)

    const isCurrentUser = computed(() => userStore.currentUser?.id === userData.value?.id)

    function toPlaylist(id){
        router.push('/playlist/' + id)
    }

    function toSong(id){
        router.push('/song/' + id)
    }

    async function fetchUserData(id){
        try{
            const user = await http.get('/users/' + id, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })

            const songsHistory = await http.get('/songs/history', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })

            userData.value = user.data
            songsData.value = songsHistory.data

            const playlists = await http.get(`/users/${id}/playlists`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            savedPlaylists.value = playlists.data
            playlistCount.value = savedPlaylists.value.playlists?.length || 0

        }
        catch (error){
            console.log('Ошибка при загрузке профиля ' + error)

            if (error.response.status == 404){
                router.push({name: 'NotFound'})
            }
        }
    }

    onMounted(() => {
        fetchUserData(route.params.id)
    })

    watch(() => route.params.id, (newId) => {
        fetchUserData(newId);
    });

    watch(() => userStore.currentUser, (newVal) => {
        if (newVal && userData.value && newVal.id === userData.value.id) {
            userData.value = { ...userData.value, ...newVal };
        }
    }, { deep: true });
</script>

<template>
    <div class="profile-container" v-if="userData">
        <TitleCard 
            type="profile" 
            :title="userData?.username"
        >
            <template #image>
                <Image :url="userData?.avatar" alt="Аватар профиля"/>
            </template>

            <template #metadata>
                <div class="profile-metadata">
                    <span>{{ userData?.email || 'Пользователь' }}</span>
                    <span class="separator">•</span>
                    <span>Плейлистов: {{ playlistCount }}</span>
                </div>
            </template>

            <template #actions>
            <div class="profile-actions-wrapper">
                <div class="profile-actions" v-if="isCurrentUser">
                    <button class="settings-btn" @click="modalStore.openModal('settings')" title="Настройки профиля">
                        <Settings width="20" height="20" />
                        <span>Редактировать профиль</span>
                    </button>
                </div>

                <RouterLink 
                    v-if="userData?.artistId" 
                    :to="'/artist/' + userData.artistId" 
                    class="artist-profile-link"
                >
                    Профиль исполнителя
                </RouterLink>
            </div>
        </template>
        </TitleCard>

        <div class="profile-content">
            <Section>
                <template #title>Плейлисты</template>
                <template #content>
                    <div class="playlists-list" v-if="playlistCount > 0">
                        <Card 
                            @click="toPlaylist(playlist.id)" 
                            v-for="playlist in savedPlaylists.playlists" 
                            :key="playlist.id"
                            :title="playlist.name" 
                            description="Плейлист"
                        >
                            <template #image>
                                <Image :url="playlist.image"/>
                            </template>
                        </Card>
                    </div>
                    
                    <div class="empty" v-else-if="isCurrentUser">
                        Вы не добавляли плейлисты
                        <Button @click="modalStore.openModal('playlist')">Добавить плейлист</Button>
                    </div>
                    <div class="empty" v-else>
                        У этого пользователя нет плейлистов
                    </div>
                </template>
            </Section>

            <Section v-if="isCurrentUser && songsData">
                <template #title>История прослушиваний</template>
                <template #content>
                    <div v-if="songsData.data?.length > 0" class="history-list">
                        <Card 
                            @click="toSong(song.id)" 
                            v-for="song in songsData.data" 
                            :key="song.id"
                            :title="song.name" 
                            description="Трек"
                            :explicit-content="song.explicit_content"

                        >
                            <template #image>
                                <Image :url="song.image"/>
                            </template>
                        </Card>
                    </div>
                    <div v-else class="empty empty-history">
                        Истории прослушанных треков нет
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
            height: 1vh;
            display: flex;
            flex-direction: column;
            gap: 32px;
            padding: 24px;

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

        .profile-actions-wrapper {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            margin-top: 8px;
        }

        .profile-actions {
            display: flex;
            align-items: center;

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

        .artist-profile-link {
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            padding: 8px 16px;
            transition: color 0.2s;

            &:hover {
                color: var(--accent-color);
            }
        }

        .empty {
            color: var(--text-secondary);
            font-size: 24px;
            text-align: center;
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .playlists-list, .history-list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .empty-history{
            padding-bottom: 100px;
        }

        .history-list{
            padding-bottom: 20px;
        }
    }

    .profile-metadata {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);
        font-size: 14px;

        .separator {
            opacity: 0.5;
            user-select: none;
            margin: 0 4px; 
        }
    }
</style>