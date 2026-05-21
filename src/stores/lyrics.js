import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLyricsStore = defineStore('lyrics', () => {
    const isOpen = ref(false)
    const currentLyrics = ref('')
    const artistsTitle = ref([])
    const songTitle = ref('')

    function openLyrics(text, artists = [], songName = '') {
        currentLyrics.value = text
        artistsTitle.value = artists
        songTitle.value = songName
        isOpen.value = true

        // console.log(text, title)
    }

    function closeLyrics() {
        isOpen.value = false
    }

    return { 
        isOpen, 
        currentLyrics, 
        artistsTitle,
        songTitle, 
        openLyrics, 
        closeLyrics, 
    }
})