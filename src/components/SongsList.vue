<script setup>
    import Song from './SongCard.vue'
</script>

<template>
    <div class="songs-list">
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"
        />
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"
        />
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"
        />
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"
        />
        <Song 
            title="Трек №1"
            :artists="['Исполнитель №1', 'Исполнитель №2']"
            :length="220"
        />
    </div>
</template>

<style scoped>
    .songs-list{
        display: flex;
        flex-direction: column;
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
        height: 1vh;
        overflow-y: scroll;
        /* scrollbar-width: thin; */
        /* scrollbar-color:  */
        
    }

    .songs-list::-webkit-scrollbar{
        background-color: rgba(0, 0, 0, 0);
        width: 5px;
    }

    .songs-list::-webkit-scrollbar-thumb{
        background-color: lightgray;
        border-radius: 10px;
    }
</style>