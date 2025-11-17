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
        overflow-y: scroll;
    }
</style>