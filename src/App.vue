<script setup>
    import ContextMenu from '@/components/ContextMenu.vue';
    import Lyrics from '@/components/Lyrics.vue';
    import { useLyricsStore } from './stores/lyrics';

    const lyricsStore = useLyricsStore()

</script>

<template>
  <RouterView/>
  <ContextMenu/>
  <Lyrics/>
</template>

<style scoped>
  
</style>
