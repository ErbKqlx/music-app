<script setup>
    import Song from './Song.vue'
</script>

<template>
    <div class="playlist-songs">
        <Song title="Трек №1" :artists="['Исполнитель №1', 'Исполнитель №2']"/>
        <Song title="Трек №2"/>
        <Song title="Трек №3"/>
        <Song title="Трек №4"/>
        <Song title="Трек №5"/>
        <Song title="Трек №6"/>
    </div>
</template>

<style scoped>
    .playlist-songs{
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
    }
</style>