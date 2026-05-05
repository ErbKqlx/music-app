<script setup>
    import ContextMenu from '@/components/ContextMenu.vue';
    import Lyrics from '@/components/Lyrics.vue';
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import { useLyricsStore } from './stores/lyrics';
    import { useRoute } from 'vue-router';
    import { computed } from 'vue';
import QueueList from './components/QueueList.vue';
import { usePlayerStore } from './stores/player';

    const lyricsStore = useLyricsStore()
    const playerStore = usePlayerStore()


    const route = useRoute();
    
    const hideLayout = computed(() => ['Login', 'Register', 'VerifyEmail', 'PasswordRecovery'].includes(route.name));
</script>

<template>
  <template v-if="!hideLayout">
    <Header></Header>
    <div class="wrapper" :class="{ 'queue-open': playerStore.isQueueOpen }">
      <PlaylistsAside/>
      <!-- <main class="main-content"> -->
        <RouterView/>
      <!-- </main> -->
      <QueueList />
    </div>
    <PlayerBar/>
  </template>

  <RouterView v-else/>

  <ContextMenu/>
  <Lyrics/>
</template>

<style scoped>
  .wrapper{
    /* display: flex;
    flex-grow: 1;
    padding: 0 10px; */
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    flex-grow: 1;
    transition: padding-right 0.3s ease;

    /* .main-content{
      flex-grow: 1;
      transition: all 0.3s ease;
    } */
  }

  .queue-open {
    padding-right: 350px;
  }

  .queue-open .main-content {
     max-width: calc(100% - 350px);
  }
</style>
