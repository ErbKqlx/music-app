<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/PlaylistsAside.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
    import PlaylistSongs from '@/components/PlaylistSongs.vue';
</script>

<template>
    <Header></Header>
    <main>
        <PlaylistsAside/>
        <div class="playlist-main-info">
            <PlaylistCard title="Плейлист №1" description="Описание"/>
            <PlaylistSongs/>
        </div>
    </main>
</template>

<style scoped>
    .playlist-main-info{
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 15px;
        flex-grow: 1;
    }
</style>