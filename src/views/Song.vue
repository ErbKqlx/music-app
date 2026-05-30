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
    import { onMounted, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import http from '../http'
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '@/stores/player'
    import { useContextMenuStore } from '@/stores/contextMenu'
    import Section from '@/components/Section.vue'
    import { formatDate } from '../composables/formatDate'
    import { useModalStore } from '../stores/modal'
    import { useLyricsStore } from '../stores/lyrics'
    import { useUserStore } from '../stores/user'

    const route = useRoute()

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore()
    const modalStore = useModalStore()
    const lyricsStore = useLyricsStore()
    const userStore = useUserStore()

    

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
                    modalStore.openModal('selectPlaylists', songData.value.data)
                }
            },
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue([songData.value.data])
                    // console.log("Добавить в очередь") 
                }
            },
             { 
                label: 'Редактировать информацию о треке', 
                action: () => {
                    modalStore.openModal('song', songData?.value.data)
                    // console.log("Редактировать информацию о треке") 
                }
            },
            { 
                label: 'Удалить трек',
                action: async () => {
                    try{
                        await http.delete(`/song/${songData?.value.data.id}`, 
                            {
                                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
                            }
                        )

                        router.push('/')
                    }
                    catch (error){
                        console.log('Ошибка при удалении трека ' + error)
                    }
                }, 
                danger: true,
            },
        ];
        contextMenuStore.open(event, options);
    }

    function handleLyricsClick() {
        // lyricsStore.toggleLyrics()
        if (!lyricsStore.isOpen){
            lyricsStore.openLyrics(songData.value.data.lyrics, songData.value.data.artists, songData.value.data.name)
        }
        else{
            lyricsStore.closeLyrics()
        }
        
    }


    watch(() => route.params.id, (newId) => {
        fetchSongData(newId);
    });

    onMounted(async () => {
        fetchSongData(route.params.id)
    })
</script>

<template>
    <!-- <Header></Header> -->
    <!-- <Wrapper> -->
        <div class="song-info">
            <TitleCard 
                :title="songData?.data.name" 
                :created_at="formatDate(songData?.data.release_date)"
                :explicit_content="songData?.data.explicit_content" >
                <template #image>
                    <Image :url="songData?.data.image"/>
                </template>
                <template #actions>
                    <Button @click="startSong(songData?.data)" class="play-button round-button"><Play color="var(--bg-primary)"/></Button>
                    <Button @click="handleLyricsClick">Посмотреть текст</Button>
                    <Button @click.stop="handleMiscClick" class="no-background round-button"><ThreeDotsHorizontal color="var(--text-primary)"/></Button>
                </template>
            </TitleCard>
            <div class="info">
                <!-- <Section>
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
                </Section> -->
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
                <!-- <Section>
                    <template #title>
                        Текст
                    </template>
                    <template #content>
                        <div class="lyrics-content">
                            <pre>{{songData?.data.lyrics || 'Текст для этой песни пока не добавлен'}}</pre>
                        </div>
                    </template>
                </Section> -->
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
    <!-- </Wrapper> -->
    <!-- <PlayerBar/> -->
</template>

<style scoped>
    .song-info{
        /* height: 1vh; */
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        button{
            background-color: var(--text-primary);
            color: var(--bg-primary);
        }

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
            height: 1vh;
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
                            color: var(--text-primary);
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

            .artist-card:hover{
                background-color: var(--bg-hover);
            }

            /* .lyrics-content {
                font-size: 1.2rem;
                line-height: 1.6;
                white-space: pre-wrap;
                color: var(--secondary-text-color);
            } */
        }
        
    }
</style>