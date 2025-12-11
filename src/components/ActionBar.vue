<script setup>
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
</script>

<template>
    <div class="action-bar">
        <Button class="play-button round-button"><Play/></Button>
        <Button class="no-background round-button"><ThreeDotsHorizontal/></Button>
    </div>
</template>

<style scoped>
    .action-bar{
        display: flex;
        gap: 5px;

        /* .misc-button svg{
            transform: rotate(90deg);
        } */
    }
</style>