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

    let timer = null
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
            // console.log(currentSong.value)
            sound.play()
            return
        }
        
        currentSong.value = song

        console.log(sound)
        if (sound){
            seekTime(0)
            sound.stop()
            // seek.value = 0
            // sound.unload()
        }

        console.log(song)
        

        sound = new Howl({
            src: [currentSong.value.song_url], // Provide multiple formats for browser compatibility
            onload: function() {
                console.log('Sound loaded successfully!');
            },
            onplay: function(id){
                isPlaying.value = true
                console.log('Sound is playing! id: ' + id);
                startTimer()
            },
            onpause: function(id) {
                console.log('Sound paused! id: ' + id);
                isPlaying.value = false
            },
            onend: function (id) {
                console.log('Sound ended! id: ' + id);
                isPlaying.value = false
            },
            onload: function() {
                console.log('Sound unloaded successfully!');
            },
            onloaderror: function(id, err) {
                console.error('Error loading sound:', err + ' ' + id);
                isPlaying.value = false
            },
            volume: volume.value
            // loop: true
        });

        // if (seek.value > 0) {
        //     sound.seek(seek.value)
        // }
        seekTime(seek.value)
        

        console.log(song == currentSong.value)
        if (song != currentSong.value){
            console.log(11111)
            seekTime(0)
        }


        sound.play()
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

    const startTimer = () => {
        stopTimer()
        timer = setInterval(() => {
            updateProgress()
            // console.log(seek.value)
        }, 100)
    }

    const stopTimer = () => {
        if (timer){
            clearInterval(timer)
        }
    }

    const seekTime = (value) => {
        seek.value = value
        sound.seek(value)
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
        seekTime,
    }
},
{
    persist: {
        storage: localStorage,
        pick: ['currentSong', 'seek', 'volume']
    }
})