<script setup>
    import Header from '@/components/Header.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import PlaylistInfoCard from '@/components/Playlist/PlaylistInfoCard.vue';
    import SongsList from '@/components/SongsList.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import Image from '@/components/Image.vue'
    import SongCard from '@/components/SongCard.vue';
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="playlist-info">
            <TitleCard title="Плейлист №1" created_by="username" created_at="28.11.2025">
                <template #image>
                    <Image/>
                </template>
            </TitleCard>
            <!-- <PlaylistInfoCard title="Плейлист №1" description="Описание"/> -->
            <SongsList>
                <SongCard 
                    title="Трек №1"
                    :artists="['Исполнитель №1', 'Исполнитель №2']"
                    :length="220"

                    v-for="i in 10"
                />
            </SongsList>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>
    <PlayerBar/>
</template>

<style scoped>
    .playlist-info{
        height: 1vh;
        flex-grow: 1;
        background-color: rgb(20, 20, 20);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;
    }
    /* .playlist-main-info{
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex-grow: 1;
        height: 100%;
    } */
</style>