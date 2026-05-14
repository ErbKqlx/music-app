import { defineStore } from 'pinia';
import http from '../http.js';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
    const query = ref('')

    const results = ref({
      songs: [],
      artists: [],
      users: []
    })

    const isLoading = ref(false)

    const fetchResults = async (searchTerm) => {
      if (!searchTerm) return;
      
      isLoading.value = true;

      try {
        const response = await http.get(`/search?q=${searchTerm}`);
        results.value = response.data;
        // console.log(results.value.songs[0])
      } 
      catch (error) {
        console.error("Ошибка поиска:", error);
      }

      isLoading.value = false;
    }

    return {
        query,
        results,
        isLoading,
        fetchResults,
    }
});