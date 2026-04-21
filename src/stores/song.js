import { defineStore } from "pinia";

export const useSongStore = defineStore('song', {
    state: () => ({
        // if (localStorage.getItem("user"))
        //     return JSON.parse(localStorage.getItem("user"))
        // return {
        //     currentUser: null,
        // }
        currentSong: null,
        currentSound: null,
    }),
    actions: {
        setSong(songData){
            this.currentSong = songData
        },
        setSound(sound){
            this.currentSound = sound
        }
    }
})