<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import ProfileCard from '@/components/Profile/ProfileCard.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
</script>

<template>
    <Header></Header>
    <main>
        <PlaylistsAside/>
        <div class="profile-info">
            <ProfileCard/>
            <div class="user-info">
                <div class="user-playlists">
                    <PlaylistCard name="Плейлист №1"/>
                </div>
                <div class="user-artists">
                    
                </div>
            </div>
        </div>
    </main>
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        background-color: rgb(55, 55, 55);
        flex-grow: 1;
    }
</style>