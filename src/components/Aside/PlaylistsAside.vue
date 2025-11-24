<script setup>
    import PlaylistCard from './PlaylistCard.vue'
</script>

<template>
    <div class="playlists-aside">
        <div class="aside-header">
            <div>
                <span>Моя музыка</span>
            </div>
            <div>
                <span class="additional-info clickable">Свернуть</span>
                <!-- <div class="resize-button">

                </div> -->
            </div>
        </div>
        <div class="playlist-cards">
            <PlaylistCard title="Плейлист №1" count="1" v-for="i in 4"/>
            <!-- <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/> -->
        </div>
        
    </div>
</template>

<style scoped>
    .playlists-aside{
        width: 20vw;
        background-color: rgb(55, 55, 55);
        padding: 10px 10px;
        border-radius: 10px;

        .aside-header{
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 15px;
        }

        .playlist-cards{
            display: flex;
            flex-direction: column;
        }

        .playlist-card:hover{
            background-color: rgb(70, 70, 70);
        }
    }
</style>