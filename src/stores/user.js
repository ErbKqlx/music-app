import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../router";

export const useUserStore = defineStore('user', () => {
    // 1. Инициализация состояния
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

    function setUser(userData) {
        currentUser.value = userData;
        
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

        router.push('/')
    }

    return {
        currentUser,
        setUser,
        logout
    };
});