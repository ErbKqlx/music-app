import { defineStore } from "pinia";
import { computed, ref } from "vue";

let sound = null

export const usePlayerStore = defineStore('player', () => {
    const currentSong = ref(null)
    const isPlaying = ref(false)
    const volume = ref(0.2)
    const seek = ref(0)
    const onRepeat = ref(false)
    const queue = ref([])
    const originalQueue = ref([])
    const isShuffled = ref(false)
    const isQueueOpen = ref(false)

    let timer = null
    let debounceTimer = null;

    const currentIndex = ref(0)

    const toggleShuffle = () => {
        isShuffled.value = !isShuffled.value

        if (isShuffled.value){
            console.log('shuffling...')
            originalQueue.value = [...queue.value]

            const current = currentSong.value
            const others = queue.value.filter(s => s.id != current?.id)

            console.log(current)

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

    const playSong = (song, index = null) => {
        console.log(song)

        if (index !== null){
            currentIndex.value = index
        }
        else{
            currentIndex.value = queue.value.findIndex(s => s.id === song.id)
        }

        if (song == currentSong.value && sound){
            sound.play()
            return
        }

        currentSong.value = song

        console.log(sound)

        if (sound){
            seekTime(0)
            stopSong()
        }

        if (!currentSong.value){
            currentSong.value = queue.value[0]
        }

        sound = new Howl({
            src: [currentSong?.value.song_url],
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
                
            },
            onstop: function (id){
                console.log('Sound stopped! id: ' + id);
                isPlaying.value = false
            },
            onloaderror: function(id, err) {
                console.error('Error loading sound:', err + ' ' + id);
                playNext()
            },
            volume: volume.value,
            loop: onRepeat.value,
        });


        seekTime(seek.value)

        if (seek.value > currentSong.value.length){
            seekTime(0)
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

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            playSong(queue.value[nextIndex]);
        }, 150);
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
        if (queue.value.length > 0){
            setQueue(queue.value.concat(songs))
            console.log('a')
        }
        else{
            setQueue(songs)
        }

    }

    const removeFromQueue = (index) => {
        queue.value.splice(index, 1);

        if (isShuffled.value && originalQueue.value.length > 0) {
            const songId = queue.value[index]?.id;
            const orgIndex = originalQueue.value.findIndex(s => s.id === songId);
            if (orgIndex !== -1) {
                originalQueue.value.splice(orgIndex, 1);
            }
        }

        if (index === currentIndex.value) {
            if (queue.value.length > 0) {
                const nextIndex = index >= queue.value.length ? 0 : index;
                playSong(queue.value[nextIndex]);
            } else {
                stopSong();
                currentSong.value = null;
            }
        }
    }


    const updateProgress = () => {
        if (sound && sound.playing()){
            seek.value = sound.seek()
        }
    }

    const startTimer = () => {
        stopTimer()
        timer = setInterval(() => {
            updateProgress()
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
        isPlaying,
        seek,
        volume,
        onRepeat,
        queue,
        originalQueue,
        currentIndex,
        isShuffled,
        isQueueOpen,
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
        removeFromQueue,
    }
},
{
    persist: {
        storage: localStorage,
        pick: ['currentSong', 'seek', 'volume', 'onRepeat', 'queue', 'isShuffled', 'originalQueue']
    }
})