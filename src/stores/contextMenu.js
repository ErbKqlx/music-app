import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useContextMenuStore = defineStore('contextMenu', () => {
    const isOpen = ref(false);
    const x = ref(0);
    const y = ref(0);
    const options = ref([]);


    
    function open(event, menuOptions) {
        x.value = event.clientX;
        y.value = event.clientY;
        options.value = menuOptions;
        isOpen.value = true;

        console.log('opened')
    }

    function close() {
        isOpen.value = false;
        console.log('closed')
    }

    return { 
        isOpen, 
        x, 
        y, 
        options, 
        open, 
        close 
    };
});