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
    <div class="aside" :class="{minimized: isMinimized}">
        <PlaylistsAsideMinimized @resize="resizeAside" v-if="isMinimized"></PlaylistsAsideMinimized>
        <PlaylistsAsideMaximized @resize="resizeAside" v-else></PlaylistsAsideMaximized>
    </div>
</template>

<style scoped>
    .aside{
        width: 100%;
        max-width: 20vw;
        transition: max-width 0.3s;
    }
    
    .minimized{
        max-width: 85px;
        transition: max-width 0.3s;
    }
</style>