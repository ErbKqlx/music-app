<script setup>
    import Song from './SongCard.vue'
</script>

<template>
    <div class="songs-list">
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"

            v-for="i in 10"
        />
    </div>
</template>

<style scoped>
    .songs-list{
        display: flex;
        flex-direction: column;
        background-color: rgb(20, 20, 20);
        flex-grow: 1;
        height: 1vh;
        overflow-y: scroll;
        /* scrollbar-width: thin; */
        /* scrollbar-color:  */
    }
</style>