<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlaylistInfoCard from '@/components/Playlist/PlaylistInfoCard.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
</script>

<template>
    <Header></Header>
    <main>
        <PlaylistsAside/>
        <div class="playlist-main-info">
            <PlaylistInfoCard title="Плейлист №1" description="Описание"/>
            <SongsList/>
        </div>
    </main>
    <PlayerBar/>
</template>

<style scoped>
    .playlist-main-info{
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex-grow: 1;
    }
</style>