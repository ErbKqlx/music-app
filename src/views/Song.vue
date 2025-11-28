<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Button from '@/components/Input/Button.vue'
    import CardsList from '@/components/CardsList.vue'
    import PlaylistCard from '@/components/PlaylistCard.vue'
    // import AddPlus from '@/assets/svg/AddPlus.svg?component'

    function toArtist(){
        router.push('/artist')
    }

    function toAlbum(){
        router.push('/album')
    }
</script>

<template>
    <Header></Header>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <div class="song-info">
                <TitleCard title="Трек №1" created_by="artist" created_at="28.11.2025"/>
                <div class="song-actions">
                    <Button class="button">+</Button>
                </div>
                <div class="info">
                    <div>
                        <CardsList title="Альбомы">
                            <PlaylistCard @click="toAlbum" v-for="i in 2" name="Альбом №1" description="Альбом"/>
                        </CardsList>
                    </div>
                    
                </div>
            </div>
            <!-- <SongsList/> -->
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .song-info{
        background-color: rgb(20, 20, 20);
        height: 1vh;
        border-radius: 10px;
        overflow-y: scroll;

        .song-actions{
            display: flex;
            gap: 5px;
            margin-top: 10px;
            padding: 0 10px;

            .button{
                aspect-ratio: 1 / 1;
                width: 10px;
                border-radius: 100%;
                font-size: 24px;
            }
        }

        .info{
            margin-top: 10px;
            padding: 0 10px;
        }
    }
</style>