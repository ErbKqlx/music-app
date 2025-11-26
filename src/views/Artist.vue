<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import SongsList from '@/components/SongsList.vue'
</script>

<template>
    <Header></Header>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <div class="profile-info">
                <TitleCard title="artist"/>
                <div class="artist-info">
                    <!-- <SongsList/> -->
                </div>
                <!-- <Footer></Footer> -->
            </div>
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        background-color: rgb(20, 20, 20);
        flex-grow: 1;
        height: 100%;
        /* display: flex;
        flex-direction: column; */
        border-radius: 10px;
    }
</style>