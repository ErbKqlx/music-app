import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const routes = [
    {
        path: "/",
        component: Playlist,
    },
    {
        path: "/404",
        component: PageNotFound,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router