<script setup>
    import Header from '@/components/Header.vue';
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
            <TitleCard title="Плейлист №1" created_by="username" created_at="28.11.2025" hasActions>
                <template #image>
                    <Image/>
                </template>
            </TitleCard>
                <!-- <div class="actions">
                    <ActionBar></ActionBar>
                    <div class="filter">

                    </div>
                    <div class="sort">
                        <SvgButton/>
                    </div>
                </div> -->
            <div class="info">
                <SongsList>
                    <SongCard 
                        title="Трек №1"
                        :artists="['Исполнитель №1', 'Исполнитель №2']"
                        :length="220"

                        v-for="i in 10"
                    />
                </SongsList>
            </div>
            <!-- <Footer></Footer> -->
        </div>
    </Wrapper>
    <PlayerBar/>
</template>

<style scoped>
    .playlist-info{
        height: 1vh;
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--primary-color);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;
        
    }
</style>