<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import CardsList from '@/components/CardsList.vue'
    import Image from '@/components/Image.vue'
    import Card from '@/components/Card.vue'
    import Wrapper from '@/components/Wrapper.vue'
    // import Lyrics from '@/components/Lyrics.vue'
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import http from '../http'
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '@/stores/player'
    import { useContextMenuStore } from '@/stores/contextMenu'
    import Section from '@/components/Section.vue'
    import { formatDate } from '../composables/formatDate'

    const route = useRoute()

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore()

    

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
            console.log(songData.value)

        }
        catch (error){
            // if (error.response.status == 401){
            //     router.push('/')
            // }
            console.log('Ошибка при загрузке трека ' + error)
        }
    }

    function startSong(song){
        playerStore.isShuffled = false
        playerStore.setQueue([song])
        
        if (playerStore.currentSong == song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            // console.log(playerStore.currentSong)
        }
        else{
            playerStore.playSong(song)
        }
    }

    function handleMiscClick(event){
        // console.log(event)
        const options = [
            { 
                label: 'Добавить в плейлист', 
                action: () => {
                    console.log("Добавить в плейлист") 
                }
            },
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    console.log("Добавить в очередь") 
                }
            },
        ];
        contextMenuStore.open(event, options);
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
                :created_at="formatDate(songData?.data.release_date)" >
                <template #image>
                    <Image :url="songData?.data.image"/>
                </template>
                <template #actions>
                    <Button @click="startSong(songData?.data)" class="play-button round-button"><Play/></Button>
                    <!-- <Button @click="showLyrics()">Посмотреть текст</Button> -->
                    <Button @click.stop="handleMiscClick" class="no-background round-button"><ThreeDotsHorizontal/></Button>
                </template>
            </TitleCard>
            <div class="info">
                <Section>
                    <template #title>
                        Альбомы
                    </template>
                    <template #content>
                        <div class="albums-list">
                            <Card @click="toAlbum" v-for="i in 5" title="Альбом №1" description="Альбом">
                                <template #image>
                                    <Image/>
                                </template>
                            </Card>
                        </div>
                    </template>
                </Section>
                <Section>
                    <template #title>
                        Исполнители
                    </template>
                    <template #content>
                        <div class="artists-list">
                            <div class="artist-card" v-for="artist in songData?.data.artists" :key="artist.id">
                                <div class="image">
                                    <Image class="round-image" :url="artist.image"/>
                                </div>
                                <div class="info">
                                    <div class="artist-name">{{ artist.name }}</div>
                                    <div class="artist-bio additional-info">{{ artist.bio || 'Нет описания'}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Section>
                <Section>
                    <template #title>
                        Текст
                    </template>
                    <template #content>
                        <div class="lyrics-content">
                            <pre>{{songData?.data.lyrics || 'Текст для этой песни пока не добавлен'}}</pre>
                        </div>
                    </template>
                </Section>
                <Section>
                    <template #title>
                        Комментарии
                    </template>
                    <template #content>
                        <div class="comments-content">
                            
                        </div>
                    </template>
                </Section>
            </div>
        </div>
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

            .albums-list{
                display: flex;
                /* gap: 50px; */
                flex-wrap: wrap;
            }

            .artists-list{
                display: flex;
                /* gap: 10px; */
                justify-content: space-between;

                .image{
                    width: 10vw;
                    align-self: center;
                }

                .artist-card{
                    display: flex;
                    gap: 10px;
                    padding: 10px;

                    .info{
                        gap: 10px;
                        flex-grow: 1;

                        .artist-name{
                            width: 100%;
                            font-size: 32px;
                            margin-bottom: 10px;
                        }

                        .artist-bio{
                            /* flex-grow: 1; */
                            width: 100%;
                            overflow-wrap: break-word;
                            flex-grow: 1;
                            line-height: 1.6;
                        }
                    }
                }
            }

            .artists-list div{
                width: 49%;
                /* background-color: rgb(41, 41, 41); */
                border-radius: 5px;
                cursor: pointer;
            }

            .artists-list div:hover{
                background-color: var(--secondary-color);
            }

            .lyrics-content {
                font-size: 1.2rem;
                line-height: 1.6;
                white-space: pre-wrap;
                color: var(--secondary-text-color);
            }
        }
        
    }
</style>