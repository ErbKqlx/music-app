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
            // console.log(savedPlaylists.value.playlists.length == 0)
            
            // console.log(savedPlaylists.value.playlists[0])
            
            // console.log(userData.value)
        }
        catch (error){
            if (error.response.status == 401){
                router.push('/')
            }
            console.log('Ошибка при загрузке профиля ' + error)
        }
    }

    onMounted(async () => {
        fetchUserData(route.params.id)

        // var sound = new Howl({
        //     src: ['Korol_i_SHut_-_Lesnik_62571704.mp3']
        // });

        
        
       
        // sound.seek(180)
        // sound.loop
    })

    watch(() => route.params.id, (newId) => {
        fetchUserData(newId);
    });
    
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="profile-info">
            <TitleCard :title = userData?.username>
                <template #image>
                    <Image :url="'http://localhost:8080/' + userData?.avatar" class="round-image"/>
                </template>
                <template #actions>
                    <!-- <Button @click="openContextMenu" class="round-button">Настройки</Button> -->
                    <span class="clickable">Настройки</span>
                </template>
            </TitleCard>
            <div class="info">
                <Section v-if="true">
                    <template #title>
                        Плейлисты
                    </template>
                    <template #content>
                        <div class="playlists-list">
                            <Card @click="toPlaylist(playlist.id)" v-for="playlist in savedPlaylists.playlists" :title=playlist.name description="Плейлист">
                                <template #image>
                                    <Image :url="playlist.image"/>
                                </template>
                            </Card>
                        </div>
                    </template>
                </Section>
                <!-- <CardsList title="Плейлисты" v-if="true">
                    
                </CardsList> -->
                <div class="empty" v-else>
                    Вы не добавляли плейлисты
                    <Button @click.stop="">Добавить плейлист</Button>
                </div>
                <!-- <div class="user-playlists">
                    
                </div> -->

                <!-- <CardsList title="Исполнители">
                    <Card @click="toArtist" v-for="i in 5" title="Исполнитель №1" description="Исполнитель">
                        <template #image>
                            <Image class="round-image"/>
                        </template>
                    </Card>
                </CardsList> -->
                
                <!-- <div class="user-artists">
                    
                </div> -->
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>    
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        /* background-color: rgb(55, 55, 55); */
        background-color: var(--primary-color);
        height: 1vh;
        flex-grow: 1;
        /* display: flex;
        flex-direction: column; */
        overflow-y: scroll;
        border-radius: 10px;

        .user-info{
            display: flex;
            flex-direction: column;
            /* gap: 50px; */
            /* padding: 20px; */
        }

        .empty{
            font-size: 24px;
            text-align: center;
            margin-top: 50px;

            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .playlists-list{
            display: flex;
            /* gap: 50px; */
        }
    }
</style>