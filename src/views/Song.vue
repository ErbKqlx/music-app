<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Button from '@/components/Input/Button.vue'
    import CardsList from '@/components/CardsList.vue'
    import PlaylistCard from '@/components/PlaylistCard.vue'
    import Lyrics from '@/components/Lyrics.vue'
    import Play from '@/assets/svg/play.svg?component'
    // import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Image from '@/components/Image.vue'
    import Card from '@/components/Card.vue'
    import ThreeDotsVertical from '@/assets/svg/ThreeDotsVertical.svg?component'
    import Wrapper from '@/components/Wrapper.vue'
    import ActionBar from '@/components/ActionBar.vue'

    function toArtist(){
        router.push('/artist')
    }

    function toAlbum(){
        router.push('/album')
    }
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="song-info">
            <TitleCard title="Трек №1" created_by="artist" created_at="28.11.2025">
                <template #image>
                    <Image/>
                </template>
            </TitleCard>
            <ActionBar></ActionBar>
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
                <!-- <Lyrics/> -->
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