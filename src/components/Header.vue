<script setup>
    import { useRoute } from 'vue-router';
    import http from '../http';
    import { useUserStore } from '../stores/user';
    import { usePlayerStore } from '../stores/player';
    import router from '../router';
    import { useSearchStore } from '../stores/search';
    import { ref } from 'vue';
    import Button from '@/components/Input/Button.vue'
    import { useModalStore } from '../stores/modal';
    
    const searchStore = useSearchStore();
    const query = ref('');

    const userStore = useUserStore()
    const playerStore = usePlayerStore()
    const modalStore = useModalStore()

    console.log(userStore.currentUser)
    function toProfile(){
        if (userStore.currentUser){
            const userId = userStore.currentUser.id
            router.push('/profile/' + userId)
        }
        else{
            router.push('/')
        }


        // const route = useRoute()
        // await http.get(`/users/${route.params.userId}`, {
        //     headers: { Authorization: "Bearer " + localStorage.getItem('token')}
        // })
        // .then(function (axiosResponse){
        //     // if ()
        //     console.log(axiosResponse)
        //     router.push(`/profile/${axiosResponse.data.id}`)
        // })
        // .catch(function (error) {
        //     console.log(error)
        //     if (error.response.status == 401){
        //         router.push('/')
        //     }
        //     // router.push('/error', error)
        // })
    }

    function logout(){
        userStore.logout()
        playerStore.stopSong()
        router.push(`/`)
        
    }

    let timeout = null;

    const handleInput = () => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            if (query.value.trim().length >= 2) {
                router.push({ 
                    path: '/search', 
                    query: { q: query.value } 
                });
            }
        }, 500);
    };
</script>

<template>
    <div class="page-header">
        <RouterLink to="/home" class="clickable">Главная</RouterLink>
        <div class="search">
            <form role="search">
                <input id="search" type="search" placeholder="поиск" v-model="query" @input="handleInput">
            </form>
        </div>
        <div>
            <Button @click="modalStore.openModal('song')">Загрузить трек</Button>
            <RouterLink :to="'/profile/' + userStore.currentUser?.id" @click="toProfile()">Профиль</RouterLink>
            <RouterLink to="/" @click="logout()">Выйти</RouterLink>
        </div>
    </div>
</template>

<style scoped>
    .page-header{
        /* background-color: rgb(70, 70, 70); */
        background-color: black;
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 20px;

        div{
            display: flex;
            gap: 20px;
        }

        .search{
            width: 30vw;
            height: 100%;

            form{
                height: 100%;
                display: flex;
                width: 100%;
            }

            input{
                border: none;
                color: var(--secondary-text-color);
                background-color: rgb(51, 51, 51);
                width: 100%;
                height: 80%;
                border-radius: 20px;
                font-size: 18px;
                padding: 0 12px;
                align-self: center;
                flex-grow: 1;
                border: 2px solid transparent;
            }

            input::placeholder{
                color: var(--secondary-text-color);
            }

            input:hover{
                border: 2px solid white;
            }
        }
    }

    a{
        color: white;
        align-self: center;
    }

    button{
        background-color: #5577ee;
        color: white;
        font-size: 14px;
    }

    button:hover{
        background-color: #5555ee;
        transform: initial;
    }
</style>