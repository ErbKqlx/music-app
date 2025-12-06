<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import TitleCard from '@/components/TitleCard.vue';
    import SongsList from '@/components/SongsList.vue'
    import Image from '@/components/Image.vue';
import Wrapper from '../components/Wrapper.vue';
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="profile-info">
            <TitleCard title="artist">
                <template #image>
                    <Image class="round-image"/>
                </template>
            </TitleCard>
            <div class="artist-info">
                <!-- <SongsList/> -->
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>
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
        overflow-y: scroll;
    }
</style>