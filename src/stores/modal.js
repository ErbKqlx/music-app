import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
    const activeModal = ref(null)
    const modalData = ref(null)

    function openModal(name, data = null) {
        activeModal.value = name
        modalData.value = data
    }

    function closeModal() {
        activeModal.value = null
        modalData.value = null
    }

    return { 
        activeModal, 
        modalData, 
        openModal, 
        closeModal 
    }
})