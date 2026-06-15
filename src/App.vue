<script setup>
    import ContextMenu from '@/components/ContextMenu.vue';
    import Lyrics from '@/components/Lyrics.vue';
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import { useLyricsStore } from './stores/lyrics';
    import { useRoute } from 'vue-router';
    import { computed, ref } from 'vue';
    import QueueList from './components/QueueList.vue';
    import { usePlayerStore } from './stores/player';
    import { useModalStore } from './stores/modal';
    import PlaylistCreateModal from './components/Modals/PlaylistCreateModal.vue';
    import SongUploadModal from './components/Modals/SongUploadModal.vue';
    import SelectPlaylists from './components/Modals/SelectPlaylists.vue';
    import { useUserStore } from './stores/user.js';
    import ToastContainer from '@/components/ToastContainer.vue'
    import EditProfileModal from '@/components/Modals/EditProfileModal.vue'
    import ArtistApplication from './components/Modals/ArtistApplication.vue';
    import ArtistBioModal from './components/Modals/ArtistBioModal.vue';
    import EditArtistModal from './components/Modals/EditArtistModal.vue';

    const lyricsStore = useLyricsStore()
    const playerStore = usePlayerStore()
    const modalStore = useModalStore()
    const userStore = useUserStore()

    const isAsideCollapsed = ref(false)

    function handleResize() {
        isAsideCollapsed.value = !isAsideCollapsed.value
    }

    const route = useRoute();
    
    const hideLayout = computed(() => ['Login', 'Register', 'VerifyEmail', 'PasswordRecovery'].includes(route.name));
</script>

<template>
    <ToastContainer />


    <template v-if="!hideLayout">
        <Header></Header>
        <div class="wrapper" :class="{ 'queue-open': playerStore.isQueueOpen }">
            <PlaylistsAside v-if="userStore.currentUser" 
                :is-collapsed="isAsideCollapsed"
                @resize="handleResize"/>
            <!-- <main class="main-content"> -->
                <RouterView/>
            <!-- </main> -->
            <QueueList />
            <PlaylistCreateModal v-if="modalStore.activeModal === 'playlist'" />
            <SongUploadModal v-if="modalStore.activeModal === 'song'" />
            <SelectPlaylists v-if="modalStore.activeModal === 'selectPlaylists'" />
            <EditProfileModal v-if="modalStore.activeModal === 'editProfile'" />
            <ArtistApplication v-if="modalStore.activeModal === 'artistApplication'" />
            <ArtistBioModal v-if="modalStore.activeModal === 'artistBio'" />
            <EditArtistModal v-if="modalStore.activeModal === 'editArtist'" />
        </div>
        <PlayerBar/>
    </template>

    <RouterView v-else/>

    <ContextMenu/>
    <Lyrics/>
</template>

<style scoped>
    .wrapper{
        display: flex;
        flex-wrap: nowrap;
        gap: 10px;
        flex-grow: 1;
        transition: padding-right 0.3s ease;
    }

    .queue-open {
        padding-right: 350px;
    }

    .queue-open .main-content {
        max-width: calc(100% - 350px);
    }
</style>
