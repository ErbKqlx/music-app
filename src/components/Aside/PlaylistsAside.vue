<script setup>
    import PlaylistsAsideMinimized from '@/components/Aside/PlaylistsAsideMinimized.vue'
    import PlaylistsAsideMaximized from '@/components/Aside/PlaylistsAsideMaximized.vue'
    import { ref } from 'vue'

    function resizeAside(){
        isMinimized.value = !isMinimized.value
    }

    const isMinimized = ref(false)
</script>

<template>
    <PlaylistsAsideMinimized @resize="resizeAside" v-if="isMinimized"></PlaylistsAsideMinimized>
    <PlaylistsAsideMaximized @resize="resizeAside" v-else></PlaylistsAsideMaximized>
</template>

<style scoped>
    
</style>