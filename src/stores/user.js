import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null,
    }),
    actions: {
        setUser(userData){
            this.currentUser = userData
        }
    }
})