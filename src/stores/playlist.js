import { defineStore } from "pinia";

export const usePlaylistStore = defineStore('playlist', {
    state: () => {
        if (localStorage.getItem("playlist"))
            return JSON.parse(localStorage.getItem("playlist"))
        return {
            savedPlaylists: null,
        }
    },
    actions: {
        setSavedPlaylists(playlistsData){
            this.savedPlaylists = playlistsData
        },
    }
})