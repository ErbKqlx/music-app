import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import Error from '@/views/Error.vue'
import Auth from '@/views/Auth.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import Artist from '@/views/Artist.vue'
import Album from '@/views/Album.vue'
import PasswordRecovery from '@/views/PasswordRecovery.vue'
import Song from '@/views/Song.vue'
import Home from '@/views/Home.vue'
import Test from '@/views/Test.vue'

const routes = [
    {
        path: "/",
        component: Auth,
    },
    {
        path: "/error",
        component: Error,
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
        path: "/profile/:id",
        component: Profile,
    },
    {
        path: "/artist",
        component: Artist,
    },
    {
        path: "/album",
        component: Album,
    },
    {
        path: "/password-recovery",
        component: PasswordRecovery,
    },
    {
        path: "/song",
        component: Song,
    },
    {
        path: "/home",
        component: Home,
    },
    {
        path: '/users',
        component: Test
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router