import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDarkMode = ref(true)
    
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDarkMode.value = savedTheme === 'dark'
        } else {

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            isDarkMode.value = prefersDark
        }
        applyTheme()
    }
    
    const applyTheme = () => {
        if (isDarkMode.value) {
            document.documentElement.setAttribute('data-theme', 'dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
        }
    }
    
    const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value
        applyTheme()
    }
    
    const setTheme = (isDark) => {
        isDarkMode.value = isDark
        applyTheme()
    }
    
    watch(isDarkMode, () => {
        applyTheme()
    })
    
    return {
        isDarkMode,
        initTheme,
        toggleTheme,
        setTheme
    }
})