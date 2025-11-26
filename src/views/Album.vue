<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import SongsList from '@/components/SongsList.vue'
</script>

<template>
    <Header></Header>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <div class="album-info">
                
            </div>
            <!-- <SongsList/> -->
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .album-info{
        background-color: rgb(20, 20, 20);
        flex-grow: 1;
        border-radius: 10px;
        height: 100%;
    }
</style>