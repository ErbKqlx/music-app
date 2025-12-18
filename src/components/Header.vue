<script setup>
    import SearchInput from './SearchInput.vue'
</script>

<template>
    <div class="page-header">
        <RouterLink to="/home" class="clickable">Название</RouterLink>
        <SearchInput/>
        <RouterLink to="/profile">Профиль</RouterLink>
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
    }

    a{
        color: white;
    }
</style>