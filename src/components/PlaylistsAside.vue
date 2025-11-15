<script setup>
    import Playlist from './Playlist.vue'
</script>

<template>
    <div class="playlists-aside">
        <div>

        </div>
        <Playlist title="Плейлист №1" count="1"/>
        <Playlist title="Плейлист №1" count="1"/>
        <Playlist title="Плейлист №1" count="1"/>
        <Playlist title="Плейлист №1" count="1"/>
    </div>
</template>

<style scoped>
    .playlists-aside{
        display: flex;
        flex-direction: column;
        width: 20vw;
        background-color: rgb(55, 55, 55);
    }
</style>