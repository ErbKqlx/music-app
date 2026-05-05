<script setup>
    import ContextMenu from '@/components/ContextMenu.vue';
    import Lyrics from '@/components/Lyrics.vue';
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue';
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
    import { useLyricsStore } from './stores/lyrics';
    import { useRoute } from 'vue-router';
    import { computed } from 'vue';

    const lyricsStore = useLyricsStore()


    const route = useRoute();
    
    const hideLayout = computed(() => ['Login', 'Register', 'VerifyEmail', 'PasswordRecovery'].includes(route.name));
</script>

<template>
  <template v-if="!hideLayout">
    <Header></Header>
    <div class="wrapper">
      <PlaylistsAside/>
      <RouterView/>
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
  }
</style>
