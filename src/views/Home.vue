<script setup>
    import Header from '@/components/Header.vue';
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import Wrapper from '@/components/Wrapper.vue'
    import Carousel from '@/components/Carousel.vue'
</script>

<template>
    <Header></Header>
    <Wrapper>
        <div class="home-info">
            <Carousel>
                
            </Carousel>
            
        </div>
    </Wrapper>
    <PlayerBar></PlayerBar>
</template>

<style scoped>
    .home-info{
        height: 1vh;
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--primary-color);
        border-radius: 10px;
        overflow-y: scroll;
        /* padding-bottom: 10px; */
    }
</style>