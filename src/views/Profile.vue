<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
    import ArtistCard from '@/components/ArtistCard.vue';
    import CardsList from '@/components/CardsList.vue';
    import Footer from '@/components/Footer.vue';
    import router from '@/router/index.js'

    function toPlaylist(){
        router.push('/playlist')
    }

    function toArtist(){
        router.push('/artist')
    }
</script>

<template>
    <Header></Header>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <div class="profile-info">
                <TitleCard title="username"/>
                <div class="user-info">
                    <CardsList title="Плейлисты">
                        <PlaylistCard @click="toPlaylist" v-for="i in 5" name="Плейлист №1" description="Плейлист"/>
                    </CardsList>
                    <!-- <div class="user-playlists">
                        
                    </div> -->

                    <CardsList title="Исполнители">
                        <ArtistCard @click="toArtist" v-for="i in 5" name="Исполнитель №1"/>
                    </CardsList>
                    
                    <!-- <div class="user-artists">
                        
                    </div> -->
                </div>
                <!-- <Footer></Footer> -->
            </div>
        </main>
    </div>
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        /* background-color: rgb(55, 55, 55); */
        background-color: rgb(20, 20, 20);
        height: 1;
        flex-grow: 1;
        /* display: flex;
        flex-direction: column; */
        overflow-y: scroll;
        border-radius: 10px;

        .user-info{
            display: flex;
            flex-direction: column;
            gap: 50px;
            padding: 20px;
            height: 1vh;
            flex-grow: 1;
        }
    }
</style>