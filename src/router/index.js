import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Auth from '@/views/Auth.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'

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
    },
    {
        path: "/profile",
        component: Profile,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router