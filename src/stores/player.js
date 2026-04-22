import { defineStore } from "pinia";
import { ref } from "vue";

let sound = null

export const usePlayerStore = defineStore('player', () => {

        // if (localStorage.getItem("user"))
        //     return JSON.parse(localStorage.getItem("user"))
        // return {
        //     currentUser: null,
        // }

        // if (localStorage.getItem('lastPlayedSong')){
        //     this.currentSong = JSON.parse(localStorage.getItem('lastPlayedSong'))
        // }
        // return {
        //     currentSong,
        //     currentSound: null,
        //     isPaused: false,
        // }
    const currentSong = ref(null)
    // const currentSound = ref(null)
    // const currentTime = ref(0)
    const isPlaying = ref(false)
    const volume = ref(0.2)
    const seek = ref(0)
    // persist: {
    //     storage: localStorage,
    //     pick: ['currentSong', 'currentTime', 'currentSound', 'isPaused']
    // },

    // const setSong = (songData) => {
    //     currentSong.value = songData
    // }

    // const setSound = (sound) => {
    //     currentSound.value = sound
    // }

    const playSong = (song) => {
        // console.log(song == songStore.currentSong)
        if (song == currentSong.value && sound){
            sound.play()
            return
        }

        if (sound){
            sound.stop()
            sound.unload()
        }

        currentSong.value = song

        sound = new Howl({
            src: [currentSong.value.song_url], // Provide multiple formats for browser compatibility
            onload: function() {
                console.log('Sound loaded successfully!');
            },
            onplay: function(){
                isPlaying.value = true
                updateProgress()
            },
            onpause: function(id) {
                console.log('Sound paused! id: ' + id);
                isPlaying.value = false
            },
            onend: function (id) {
                console.log('Sound ended! id: ' + id);
                isPlaying.value = false
            },
            onloaderror: function(id, err) {
                console.error('Error loading sound:', err + ' ' + id);
                isPlaying.value = false
            },
            volume: volume.value
            // loop: true
        });

        if (seek.value > 0) {
            sound.seek(seek.value)
        }

        // else{
        //     // if (currentSound.value){
        //     //     currentSound.value.stop()
        //     //     isPaused.value = false
        //     // }
            
        //     setSong(song)

            

        //     sound.volume(volume.value)
        //     sound.play()
        //     // setSound(sound)
        //     // currentSound.value.play()
        // }

        // console.log(sound)
        // console.log(songStore)
    }

    const pauseSong = () => {
        if (sound){
            sound.pause()
        }
    }

    const updateProgress = () => {
        if (sound && sound.playing()){
            seek.value = sound.seek()
            // requestAnimationFrame(() => updateProgress())
        }
    }


    return {
        currentSong,
        // currentSound,
        isPlaying,
        seek,
        volume,
        // setSong,
        // setSound,
        updateProgress,
        playSong,
        pauseSong,
    }
},
{
    persist: {
        storage: localStorage,
        pick: ['currentSong', 'seek', 'volume']
    }
})