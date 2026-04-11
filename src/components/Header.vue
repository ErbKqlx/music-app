<script setup>
    import http from '../http';
    import SearchInput from './SearchInput.vue'

    async function logout(){
        await http.post('/logout')
            .then(function (axiosResponse){
                localStorage.setItem('token', null)
                router.push(`/`)
                console.log(axiosResponse)
            })
    }
</script>

<template>
    <div class="page-header">
        <RouterLink to="/home" class="clickable">Название</RouterLink>
        <SearchInput/>
        <div>
            <RouterLink to="/profile">Профиль</RouterLink>
            <RouterLink @click="logout()">Выйти</RouterLink>
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