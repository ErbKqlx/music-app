import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
    const onRepeat = ref(false)
    const queue = ref([])
    const originalQueue = ref([])
    const isShuffled = ref(false)
    const isQueueOpen = ref(false)
    // const isMuted = ref(false)

    let timer = null
    let debounceTimer = null;
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

    const currentIndex = computed(() => {
        return queue.value.findIndex(song => song.id == currentSong.value?.id)
    })

    const toggleShuffle = () => {
        isShuffled.value = !isShuffled.value

        if (isShuffled.value){
            console.log('shuffling...')
            originalQueue.value = [...queue.value]

            const current = currentSong.value
            const others = queue.value.filter(s => s.id != current.id)

            shuffleArray(others)

            queue.value = current ? [current, ...others] : others
        }
        else{
            if (originalQueue.value.length > 0){
                queue.value = [...originalQueue.value]
            }
        }
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const playSong = (song) => {
        // console.log(song == songStore.currentSong)
        // console.log(song == currentSong.value)
        console.log(song)
        if (song == currentSong.value && sound){
            // console.log(currentSong.value)
            // console.log(sound)
            sound.play()
            return
        }

        currentSong.value = song

        console.log(sound)

        if (sound){
            seekTime(0)
            // sound.stop()
            // sound.off()
            // sound.unload()
            // sound = null
            // // seek.value = 0
            // // sound.unload()
            stopSong()
        }

        if (!currentSong.value){
            currentSong.value = queue.value[0]
        }

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
                if (!onRepeat.value){
                    playNext()
                }
                
                // seekTime(0)
            },
            onstop: function (id){
                console.log('Sound stopped! id: ' + id);
                isPlaying.value = false
            },
            onloaderror: function(id, err) {
                console.error('Error loading sound:', err + ' ' + id);
                // isPlaying.value = false
                playNext()
            },
            volume: volume.value,
            loop: onRepeat.value,
        });

        // if (seek.value > 0) {
        //     sound.seek(seek.value)
        // }
        seekTime(seek.value)

        if (seek.value > currentSong.value.length){
            seekTime(0)
            // console.log(currentSong.length)
        }

        sound.play()
    }

    const pauseSong = () => {
        if (sound){
            sound.pause()
        }
    }

    const stopSong = () => {
        if (sound){
            sound.stop()
            sound.off()
            sound.unload()
            sound = null
        }
    }

    const playNext = () => {
        if (queue.value.length == 0) return

        let nextIndex = currentIndex.value + 1
        // if (nextIndex > queue.value.length){
        //     nextIndex = 0
        // }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            playSong(queue.value[nextIndex]);
        }, 150);
        // playSong(queue.value[nextIndex])
    }

    const playPrev = () => {
        if (queue.value.length === 0) return

        if (seek.value > 3) {
            seekTime(0)
            return
        }

        let prevIndex = currentIndex.value - 1
        if (prevIndex < 0) {
            prevIndex = queue.value.length - 1
        }

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            playSong(queue.value[prevIndex])
        }, 150)
        // playSong(queue.value[prevIndex]);
    }

    const setQueue = (songs) => {
        queue.value = songs

        if (isShuffled.value){
            const current = currentSong.value
            const others = queue.value.filter(s => s.id != current?.id)

            shuffleArray(others)

            queue.value = current ? [current, ...others] : others
        }
    }

    const toggleQueue = () => {
        isQueueOpen.value = !isQueueOpen.value
    }

    const addToQueue = (songs) => {
        // console.log(queue.value.length)
        if (queue.value.length > 0){
            // console.log('a')
            setQueue(queue.value.concat(songs))
            console.log('a')
        }
        else{
            setQueue(songs)
        }

        // console.log(currentQueue ? [currentQueue, ...songs] : songs)
        // queue.value = currentQueue ? [currentQueue, ...songs] : songs
    }

    const removeFromQueue = (song) => {
        
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

    const setRepeat = (value) => {
        onRepeat.value = !value
        console.log(sound.loop(onRepeat.value))
    }

    const setVolume = (value) => {
        volume.value = value

        if (sound){
            sound.volume(value)
        }
    }

    return {
        currentSong,
        // currentSound,
        isPlaying,
        seek,
        volume,
        onRepeat,
        queue,
        originalQueue,
        currentIndex,
        isShuffled,
        isQueueOpen,
        // setSong,
        // setSound,
        updateProgress,
        playSong,
        pauseSong,
        seekTime,
        setRepeat,
        setQueue,
        playNext,
        playPrev,
        toggleShuffle,
        setVolume,
        stopSong,
        addToQueue,
        toggleQueue,
    }
},
{
    persist: {
        storage: localStorage,
        pick: ['currentSong', 'seek', 'volume', 'onRepeat', 'queue', 'isShuffled', 'originalQueue']
    }
})