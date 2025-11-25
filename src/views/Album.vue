<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import SongsList from '@/components/SongsList.vue'
</script>

<template>
    <Header></Header>
    <main>
        <PlaylistsAside/>
        <div class="album-info">
            
        </div>
        <!-- <SongsList/> -->
    </main>
    <PlayerBar/>
</template>

<style scoped>
    .album-info{
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
    }
</style>