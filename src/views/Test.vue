<script setup>
    import { getUsers } from '../services/userService';

    function test(){
        getUsers()
            .then(response => console.log(response.data))
            .catch(e => {
                console.log(e)
            })
    }
</script>

<template>
    <button @click="test()">Получить пользователей</button>
</template>

<style scoped>
    button{
        width: 100px;
        height: 100px;
    }
</style>