<script setup>
    import Header from '@/components/Header.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'
    import SongCard from '@/components/SongCard.vue';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import router from '@/router/index.js';
    import http from '../http';


    const route = useRoute()

    const playlistData = ref(null)
    const playlistSongs = ref([])

    async function fetchPlaylistData(id){
        try{
            const playlist = await http.get('/playlist/' + id, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })
            // console.log(playlist.data)

            playlistData.value = playlist.data

            // const songs = await http.get(`/playlist/${id}/songs`, {
            //     headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            // })
            // playlistSongs.value = songs.data
            console.log(playlistData.value)
            // console.log(playlistData.value)
            // console.log(userData.value)
        }
        catch (error){
            if (error.response.status == 401){
                router.push('/')
            }
            console.log('Ошибка при загрузке плейлиста ' + error)
        }
    }

    onMounted(async () => {
        fetchPlaylistData(route.params.id)
    })
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="playlist-info">
            <TitleCard 
                :title="playlistData?.data.name" 
                :id_user="playlistData?.data.user.id"
                :username="playlistData?.data.user.username" 
                :created_at="playlistData?.data.created_at" 
                hasActions>
                <template #image>
                    <Image :url="playlistData?.data.image"/>
                </template>
            </TitleCard>
                <!-- <div class="actions">
                    <ActionBar></ActionBar>
                    <div class="filter">

                    </div>
                    <div class="sort">
                        <SvgButton/>
                    </div>
                </div> -->
            <div class="info">
                <SongsList v-if="playlistData?.data.songs.length > 0">
                    <SongCard v-for="song in playlistData?.data.songs"
                        :title="song.name"
                        :artists="song.artists"
                        :length="song.length"
                        :image_url="song.image"
                        :id_song="song.id"
                    />
                </SongsList>
                <div class="empty" v-else>
                    В этом плейлисте нет треков
                </div>
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>
    <PlayerBar/>
</template>

<style scoped>
    .playlist-info{
        height: 1vh;
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--primary-color);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;
        
        .empty{
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
        }
    }
</style>