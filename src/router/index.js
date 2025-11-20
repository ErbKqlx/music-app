import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Auth from '@/views/Auth.vue'
import Register from '@/views/Register.vue'

const routes = [
    {
        path: "/",
        component: Playlist,
    },
    {
        path: "/404",
        component: PageNotFound,
    },
    {
        path: "/auth",
        component: Auth,
    },
    {
        path: "/register",
        component: Register,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router