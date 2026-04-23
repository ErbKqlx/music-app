<script setup>
    import PlaylistsAsideMinimized from '@/components/Aside/PlaylistsAsideMinimized.vue'
    import PlaylistsAsideMaximized from '@/components/Aside/PlaylistsAsideMaximized.vue'
    import { onMounted, ref } from 'vue'
    import { useUserStore } from '../../stores/user'
    import http from '../../http'

    function resizeAside(){
        isMinimized.value = !isMinimized.value
    }

    const isMinimized = ref(false)
    const playlistsData = ref(null)

    const userStore = useUserStore()

    // async function fetchPlaylistsData() {
    //     try{
    //         const playlists = await http.get(`/users/${userStore.currentUser.id}/playlists`, {
    //             headers: { Authorization: "Bearer " + localStorage.getItem('token')}
    //         })
    //         playlistsData.value = playlists.data
    //         console.log(playlistsData.value)

            
    //         // console.log(userData.value)
    //     }
    //     catch (error){
    //         // if (error.response.status == 401){
    //         //     router.push('/')
    //         // }
    //         console.log('Ошибка при загрузке плейлистов ' + error)
    //     }
    // }

    // onMounted(() => {
    //     fetchPlaylistsData()
    // })
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