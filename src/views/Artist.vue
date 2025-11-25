<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import ProfileCard from '@/components/Profile/ProfileCard.vue';
    import SongsList from '@/components/SongsList.vue'
</script>

<template>
    <Header></Header>
    <main>
        <PlaylistsAside/>
        <div class="profile-info">
            <ProfileCard username="artist"/>
            <div class="artist-info">
                <!-- <SongsList/> -->
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </main>
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
    }
</style>