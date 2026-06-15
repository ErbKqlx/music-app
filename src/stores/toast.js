import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([])

    function show(message, type = 'success') {
        const isDuplicate = toasts.value.some(t => t.message === message);
    
        if (isDuplicate) return;

        const id = Date.now() + Math.random()

        toasts.value.push({ id, message, type })

        setTimeout(() => {
            remove(id)
        }, 3000)
    }

    function remove(id) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, show, remove }
})