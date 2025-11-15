import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '../views/Playlist.vue'

const routes = [
    {
        path: "/",
        component: Playlist,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router