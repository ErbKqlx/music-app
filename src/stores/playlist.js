import { defineStore } from "pinia";
import { ref, watch } from "vue";
import http from '@/http.js';

export const usePlaylistStore = defineStore('playlist', () => {
    const savedPlaylists = ref(
        localStorage.getItem("playlist") 
            ? JSON.parse(localStorage.getItem("playlist")).savedPlaylists 
            : null
    );

    function setSavedPlaylists(playlistsData) {
        savedPlaylists.value = playlistsData;
    }

    async function fetchPlaylists(userId) {
        if (!userId) return;
        try {
            const response = await http.get(`/users/${userId}/playlists`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            });
            savedPlaylists.value = response.data;
        } catch (error) {
            console.error('Ошибка при обновлении плейлистов в сторе:', error);
            throw error;
        }
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
        setSavedPlaylists,
        fetchPlaylists
    };
});