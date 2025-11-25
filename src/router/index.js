import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Auth from '@/views/Auth.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import Artist from '@/views/Artist.vue'
import Album from '@/views/Album.vue'

const routes = [
    {
        path: "/",
        component: Auth,
    },
    {
        path: "/404",
        component: PageNotFound,
    },
    {
        path: "/playlist",
        component: Playlist,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/artist",
        component: Artist,
    },
    {
        path: "/album",
        component: Album,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router