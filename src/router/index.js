import { createRouter, createWebHistory } from 'vue-router'
import Playlist from '@/views/Playlist.vue'
import Auth from '@/views/Auth.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import Artist from '@/views/Artist.vue'
import Album from '@/views/Album.vue'
import PasswordRecovery from '@/views/PasswordRecovery.vue'
import Song from '@/views/Song.vue'
import Home from '@/views/Home.vue'
import Test from '@/views/Test.vue'
import NotFound from '@/views/NotFound.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import Search from '@/views/Search.vue'

const routes = [
    {
        path: "/login",
        component: Auth,
        name: 'Login',
    },
    {
        path: "/playlist/:id",
        component: Playlist,
    },
    {
        path: "/register",
        component: Register,
        name: 'Register',
    },
    {
        path: "/profile/:id",
        component: Profile,
    },
    {
        path: "/artist/:id",
        component: Artist,
    },
    {
        path: "/album",
        component: Album,
    },
    {
        path: "/password-recovery",
        component: PasswordRecovery,
        name: 'PasswordRecovery',
    },
    {
        path: "/song/:id",
        component: Song,
    },
    {
        path: "/",
        component: Home,
    },
    {
        path: '/users',
        component: Test
    },
    {
        path: '/verify-email',
        component: VerifyEmail,
        name: 'VerifyEmail',
    },
    {
        path: '/search',
        component: Search,
        name: 'Search',
    },
    {
        path: "/:pathMatch(.*)*",
        name: 'NotFound',
        component: NotFound,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router