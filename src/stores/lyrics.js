import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLyricsStore = defineStore('lyrics', () => {
    const isOpen = ref(false)
    const currentLyrics = ref('')
    const songTitle = ref('')

    function openLyrics(text, title = '') {
        currentLyrics.value = text
        songTitle.value = title
        isOpen.value = true

        console.log(text, title)
    }

    function closeLyrics() {
        isOpen.value = false
    }

    return { 
        isOpen, 
        currentLyrics, 
        songTitle, 
        openLyrics, 
        closeLyrics, 
    }
})