import axios from "axios"
import router from '@/router/index.js'
import { useUserStore } from "./stores/user";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-type": "application/json"
    }
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            // config.headers["x-access-token"] = token
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Токен истек или невалиден")
            
            // localStorage.removeItem('token')
            

            const userStore = useUserStore();
            userStore.logout();

        
            // if (router.currentRoute.value.path !== '/') {
            //     router.push('/')
            // }
        }
        
        return Promise.reject(error)
    }
)

export default instance