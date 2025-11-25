<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import router from '@/router/index.js'

    function toPlaylist(){
        router.push('/playlist')
    }
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
            <PlaylistCard @click="toPlaylist" title="Плейлист №1" count="1" v-for="i in 4"/>
            <!-- <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/> -->
        </div>
        
    </div>
</template>

<style scoped>
    .playlists-aside{
        width: 20vw;
        background-color: rgb(20, 20, 20);
        padding: 10px 10px;
        border-radius: 10px;

        .aside-header{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .playlist-cards{
            display: flex;
            flex-direction: column;
        }
    }
</style>