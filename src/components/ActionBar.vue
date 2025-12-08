<script setup>
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsVertical from '@/assets/svg/ThreeDotsVertical.svg?component'
</script>

<template>
    <div class="action-bar">
        <Button class="play-button"><Play/></Button>
        <Button class="misc-button"><ThreeDotsVertical/></Button>
    </div>
</template>

<style scoped>
    .action-bar{
        margin: 10px 0;
        display: flex;
        gap: 5px;

        .misc-button svg{
            transform: rotate(90deg);
        }
    }
</style>