<script setup>
    import Song from './SongCard.vue'
</script>

<template>
    <div class="songs-list">
        <slot></slot>
        <!-- <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"

            v-for="i in 10"
        /> -->
    </div>
</template>

<style scoped>
    .songs-list{
        display: flex;
        flex-direction: column;
        /* background-color: rgb(20, 20, 20); */
        /* padding: 0 10px; */
        /* scrollbar-width: thin; */
        /* scrollbar-color:  */
    }
</style>