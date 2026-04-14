<script setup>
    import { useRoute } from 'vue-router';
    import http from '../http';
    import SearchInput from './SearchInput.vue'
    import { useUserStore } from '../stores/user';
    import router from '../router';

    const userStore = useUserStore()

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

    async function logout(){
        if (userStore.currentUser){
            userStore.setUser(null)
            localStorage.setItem('token', null)
            // await http.post('/logout')
            //     .then(function (axiosResponse){
            //         localStorage.setItem('token', null)
            //         router.push(`/`)
            //         console.log(axiosResponse)
            //     })
        }
        else{
            router.push(`/`)
        }
        
    }
</script>

<template>
    <div class="page-header">
        <RouterLink to="/home" class="clickable">Название</RouterLink>
        <SearchInput/>
        <div>
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
    }

    a{
        color: white;
    }
</style>