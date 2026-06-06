import { defineStore } from "pinia";
import { computed, ref } from "vue";
import router from "../router";
import { usePlayerStore } from "./player";

export const useUserStore = defineStore('user', () => {
    const getInitialUser = () => {
        const savedData = localStorage.getItem("user");
        
        if (!savedData || savedData === "undefined") {
            return null;
        }

        try {
            const parsed = JSON.parse(savedData);
            return parsed.currentUser ?? parsed;
        } catch (e) {
            console.error("Ошибка парсинга localStorage:", e);
            return null;
        }
    };

    const currentUser = ref(getInitialUser());

    const isAuthenticated = computed(() => !!currentUser.value);

    const userRole = computed(() => currentUser.value?.role_name || 'Гость');

    const isAdmin = computed(() => userRole.value === 'Администратор');

    const isArtist = computed(() => userRole.value === 'Исполнитель' || userRole.value === 'Администратор');

    const isModerator = computed(() => userRole.value === 'Модератор' || userRole.value === 'Администратор');

    function setUser(userData) {
        currentUser.value = userData;

        console.log(userData)
        
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
    }

    function logout() {
        currentUser.value = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        const playerStore = usePlayerStore()
        playerStore.stopSong()

        router.push('/login')
    }

    return {
        currentUser,
        isAuthenticated,
        userRole,
        isAdmin,
        isArtist,
        isModerator,
        setUser,
        logout
    };
});