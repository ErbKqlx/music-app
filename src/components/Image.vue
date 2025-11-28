<script setup>
    defineProps({
        isRound: Boolean,
    })
</script>

<template>
    <!-- Потом переделать -->
    <!-- <div v-if="isRound" class="round-image">
        
    </div> -->
    <div class="image">
        
    </div>
</template>

<style scoped>
    .round-image, .image{
        aspect-ratio: 1 / 1;
        min-width: 12vw;
        background-color: lightgray;
        border-radius: 10px;
    }

    .round-image{
        border-radius: 100%;
    }
</style>