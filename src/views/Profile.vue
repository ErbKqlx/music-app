<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
    import ArtistCard from '@/components/ArtistCard.vue';
    import CardsList from '@/components/CardsList.vue';
    // import Footer from '@/components/Footer.vue';
    import router from '@/router/index.js';
    import Image from '@/components/Image.vue';
    import Card from '@/components/Card.vue';
    import Wrapper from '@/components/Wrapper.vue';
    import { onBeforeMount, onMounted, ref, watch } from 'vue';
    import http from '../http';
    import { useRoute } from 'vue-router';
    import Button from '@/components/Input/Button.vue'
    import Settings from '@/assets/svg/settings.svg?component'
    import Section from '@/components/Section.vue';
    import { useUserStore } from '../stores/user';
    import { useModalStore } from '../stores/modal';
    // import soundFile from './Korol_i_SHut_-_Lesnik_62571704.mp3'

    const route = useRoute()

    function toPlaylist(id){
        router.push('/playlist/' + id)
    }

    function toArtist(){
        router.push('/artist')
    }

    const userData = ref(null)
    const savedPlaylists = ref([])
    const playlistCount = ref(0)

    const userStore = useUserStore()
    const modalStore = useModalStore()

    // onBeforeMount(async () => {
        
    // })

    async function fetchUserData(id){
        try{
            const user = await http.get('/users/' + id, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            userData.value = user.data
            console.log(userData.value)

            const playlists = await http.get(`/users/${id}/playlists`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            savedPlaylists.value = playlists.data
            playlistCount.value = savedPlaylists.value.playlists.length

        }
        catch (error){
            console.log('Ошибка при загрузке профиля ' + error)
        }
    }

    onMounted(async () => {
        fetchUserData(route.params.id)
    })

    watch(() => route.params.id, (newId) => {
        fetchUserData(newId);
    });
    
</script>

<template>
    <div class="profile-info">
        <TitleCard :title = userData?.username>
            <template #image>
                <Image :url="userData?.avatar" class="round-image"/>
            </template>
            <template #actions>
            </template>
        </TitleCard>
        <div class="info">
            <Section v-if="true">
                <template #title>
                    Плейлисты
                </template>
                <template #content>
                    <div class="playlists-list" v-if="playlistCount > 0">
                        <Card @click="toPlaylist(playlist.id)" v-for="playlist in savedPlaylists.playlists" :title=playlist.name description="Плейлист">
                            <template #image>
                                <Image :url="playlist.image"/>
                            </template>
                        </Card>
                    </div>
                    <div class="empty" v-else-if="userStore.currentUser?.id == userData?.id">
                        Вы не добавляли плейлисты
                        <Button @click="modalStore.openModal('playlist')">Добавить плейлист</Button>
                    </div>
                    <div class="empty" v-else>
                        У этого пользователя нет плейлистов
                    </div>
                </template>
            </Section>

            <Section v-if="userStore.currentUser?.id == userData?.id">
                <template #title>
                    История
                </template>
                <template #content>
                    <div class="empty">
                        Истории прослушанных треков нет
                    </div>
                </template>
            </Section>
        </div>
    </div>
</template>

<style scoped>
    .profile-info{
        background-color: var(--bg-tertiary);
        flex-grow: 1;
        overflow-y: scroll;
        border-radius: 10px;

        .user-info{
            display: flex;
            flex-direction: column;
        }

        .empty{
            color: var(--text-secondary);
            font-size: 24px;
            text-align: center;
            margin-top: 50px;

            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .playlists-list{
            display: flex;
            flex-wrap: wrap;
        }
    }
</style>