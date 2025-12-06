<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import SongsList from '@/components/SongsList.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'
    import ActionBar from '@/components/ActionBar.vue';
import Wrapper from '../components/Wrapper.vue';

</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="album-info">
            <TitleCard title="Альбом №1" created_by="artist" created_at="28.11.2025">
                <template #image>
                    <Image/>
                </template>
            </TitleCard>
            <ActionBar></ActionBar>
        </div>
        <!-- <SongsList/> -->
    </Wrapper>
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