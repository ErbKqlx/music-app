<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'

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
                
            </div>
            <!-- <SongsList/> -->
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .song-info{
        background-color: rgb(20, 20, 20);
        flex-grow: 1;
        height: 100%;
        border-radius: 10px;
    }
</style>