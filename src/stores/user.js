import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => {
        if (localStorage.getItem("user"))
            return JSON.parse(localStorage.getItem("user"))
        return {
            currentUser: null,
        }
        // currentUser: null,
    },
    actions: {
        setUser(userData){
            this.currentUser = userData
        },
    }
})