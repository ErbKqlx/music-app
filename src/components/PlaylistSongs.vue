<script setup>
    import Song from './Song.vue'
</script>

<template>
    <div class="playlist-songs">
        <Song title="Трек №1" :artists="['Исполнитель №1', 'Исполнитель №2']"/>
        <Song title="Трек №1" :artists="['Исполнитель №1', 'Исполнитель №2']"/>
        <Song title="Трек №1" :artists="['Исполнитель №1', 'Исполнитель №2']"/>
        <Song title="Трек №1" :artists="['Исполнитель №1', 'Исполнитель №2']"/>
    </div>
</template>

<style scoped>
    .playlist-songs{
        display: flex;
        flex-direction: column;
        gap: 5px;
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
    }
</style>