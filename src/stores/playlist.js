import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePlaylistStore = defineStore('playlist', () => {
    const savedPlaylists = ref(
        localStorage.getItem("playlist") 
            ? JSON.parse(localStorage.getItem("playlist")).savedPlaylists 
            : null
    );

    function setSavedPlaylists(playlistsData) {
        savedPlaylists.value = playlistsData;
    }

    watch(
        savedPlaylists, 
        (newPlaylists) => {
            localStorage.setItem("playlist", JSON.stringify({ savedPlaylists: newPlaylists }));
        }, 
        { deep: true }
    );

    return {
        savedPlaylists,
        setSavedPlaylists
    };
});