<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import SongsList from '@/components/SongsList.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'

</script>

<template>
    <Header></Header>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <div class="album-info">
                <TitleCard title="Альбом №1" created_by="artist" created_at="28.11.2025">
                    <template #image>
                        <Image/>
                    </template>
                </TitleCard>
            </div>
            <!-- <SongsList/> -->
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .album-info{
        height: 1vh;
        flex-grow: 1;
        background-color: rgb(20, 20, 20);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;
    }
</style>