<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import CardsList from '@/components/CardsList.vue'
    import Image from '@/components/Image.vue'
    import Card from '@/components/Card.vue'
    import Wrapper from '@/components/Wrapper.vue'
    import Lyrics from '@/components/Lyrics.vue'
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import http from '../http'
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '../stores/player'

    const route = useRoute()

    const playerStore = usePlayerStore()

    // function toArtist(){
    //     router.push('/artist')
    // }

    // function toAlbum(){
    //     router.push('/album')
    // }

    const songData = ref(null)

    async function fetchSongData(id_song) {
        try{
            const song = await http.get('/song/' + id_song, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })

            songData.value = song.data
        }
        catch (error){
            if (error.response.status == 401){
                router.push('/')
            }
            console.log('Ошибка при загрузке трека ' + error)
        }
    }

    onMounted(async () => {
        fetchSongData(route.params.id)
    })
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="song-info">
            <TitleCard 
                :title="songData?.data.name" 
                :created_by="''" 
                :created_at="songData?.data.release_date" >
                <template #image>
                    <Image :url="songData?.data.image"/>
                </template>
                <template #actions>
                    <Button @click="playerStore.playSong(songData?.data)" class="play-button round-button"><Play/></Button>
                    <Button @click="openContextMenu" class="no-background round-button"><ThreeDotsHorizontal/></Button>
                </template>
            </TitleCard>
            <!-- <ActionBar></ActionBar> -->
            <!-- <div class="song-actions">
                <Button class="button play-btn"><Play/></Button>
                <Button class="button misc"><ThreeDotsVertical color="white"/></Button>
                <div>
                    <Button class="button add">Добавить в плейлист</Button>
                </div>
            </div> -->
            <div class="info">
                <div>
                    <CardsList title="Альбомы">
                        <Card @click="toAlbum" v-for="i in 5" title="Альбом №1" description="Альбом">
                            <template #image>
                                <Image/>
                            </template>
                        </Card>
                    </CardsList>
                </div>
                <Lyrics/>
            </div>
        </div>
        <!-- <SongsList/> -->
    </Wrapper>
    <PlayerBar/>
</template>

<style scoped>
    .song-info{
        height: 1vh;
        flex-grow: 1;
        background-color: rgb(20, 20, 20);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .song-actions{
            display: flex;
            /* justify-content: space-between; */
            gap: 5px;
            margin-top: 10px;
            padding: 0 10px;

            .button{
                min-width: 10px;
                height: 50px;
                /* border-radius: 100%; */
                font-size: 14px;
            }

            .play-btn{
                border-radius: 100%;
            }
        }

        .info{
            margin-top: 10px;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            gap: 50px;
        }
    }
</style>