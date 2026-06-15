import axios from "axios"
import router from '@/router/index.js'
import { useUserStore } from "./stores/user";
import { useToastStore } from "./stores/toast";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 15000
    // headers: {
    //     "Content-type": "application/json"
    // }
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

            const userStore = useUserStore();
            userStore.logout();
        }

        if (error.response && error.response.status === 403) {
            const data = error.response.data;
            
            console.log(data.code)

            if (data && data.code === 'ACCOUNT_BANNED') {
                console.error("Пользователь заблокирован в системе");
                
                const userStore = useUserStore();
                
                userStore.logout(data.message || 'Ваш аккаунт заблокирован.'); 

                // router.push('/login')

            }
        }
        
        return Promise.reject(error)
    }
)

export default instance