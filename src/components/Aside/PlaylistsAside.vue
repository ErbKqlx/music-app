<script setup>
    import PlaylistsAsideMinimized from '@/components/Aside/PlaylistsAsideMinimized.vue'
    import PlaylistsAsideMaximized from '@/components/Aside/PlaylistsAsideMaximized.vue'
    import { computed, onMounted, ref } from 'vue'
    import { useUserStore } from '../../stores/user'
    import http from '../../http'
    import { usePlaylistStore } from '../../stores/playlist'
    import { useToastStore } from '../../stores/toast'

    function resizeAside(){
        isMinimized.value = !isMinimized.value
    }

    const isMinimized = ref(false)

    const userStore = useUserStore()
    const playlistStore = usePlaylistStore()
    const toastStore = useToastStore()

    const playlistsData = computed(() => playlistStore.savedPlaylists)
    const playlistCount = computed(() => playlistStore.savedPlaylists?.playlists?.length || 0)

    onMounted(() => {
        if (!playlistStore.savedPlaylists) {
            playlistStore.fetchPlaylists(userStore.currentUser.id)
        }
    })
</script>

<template>
    <div class="aside" :class="{minimized: isMinimized}">
        <PlaylistsAsideMinimized @resize="resizeAside" v-if="isMinimized" :playlists="playlistsData?.playlists"></PlaylistsAsideMinimized>
        <PlaylistsAsideMaximized @resize="resizeAside" v-else :playlists="playlistsData?.playlists" :count="playlistCount"></PlaylistsAsideMaximized>
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