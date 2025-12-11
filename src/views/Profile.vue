<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import PlaylistCard from '@/components/PlaylistCard.vue';
    import ArtistCard from '@/components/ArtistCard.vue';
    import CardsList from '@/components/CardsList.vue';
    import Footer from '@/components/Footer.vue';
    import router from '@/router/index.js';
    import Image from '@/components/Image.vue';
    import Card from '@/components/Card.vue';
    import Wrapper from '@/components/Wrapper.vue';

    function toPlaylist(){
        router.push('/playlist')
    }

    function toArtist(){
        router.push('/artist')
    }
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="profile-info">
            <TitleCard title="username">
                <template #image>
                    <Image class="round-image"/>
                </template>
            </TitleCard>
            <div class="info">
                <CardsList title="Плейлисты">
                    <!-- <PlaylistCard @click="toPlaylist" v-for="i in 5" name="Плейлист №1" description="Плейлист"/> -->
                    <Card @click="toPlaylist" v-for="i in 5" title="Плейлист №1" description="Плейлист">
                        <template #image>
                            <Image/>
                        </template>
                    </Card>
                </CardsList>
                <!-- <div class="user-playlists">
                    
                </div> -->

                <CardsList title="Исполнители">
                    <!-- <ArtistCard @click="toArtist" v-for="i in 5" name="Исполнитель №1"/> -->
                    <Card @click="toArtist" v-for="i in 5" title="Исполнитель №1" description="Исполнитель">
                        <template #image>
                            <Image class="round-image"/>
                        </template>
                    </Card>
                </CardsList>
                
                <!-- <div class="user-artists">
                    
                </div> -->
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>    
    <PlayerBar/>
</template>

<style scoped>
    .profile-info{
        /* background-color: rgb(55, 55, 55); */
        background-color: rgb(20, 20, 20);
        height: 1vh;
        flex-grow: 1;
        /* display: flex;
        flex-direction: column; */
        overflow-y: scroll;
        border-radius: 10px;

        .user-info{
            display: flex;
            flex-direction: column;
            /* gap: 50px; */
            /* padding: 20px; */
        }
    }
</style>