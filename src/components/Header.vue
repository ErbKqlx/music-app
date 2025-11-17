<script setup>
    import SearchInput from './SearchInput.vue'
</script>

<template>
    <div class="page-header">
        <span class="header-logo">Название</span>
        <SearchInput/>
        <div>
            <!-- <div class="avatar">
                <img src="assets/d.png" alt="Аватарка">
            </div> -->
            <!-- <div>
                <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L9.5 9.5L17.5 1.5" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
    .page-header{
        background-color: rgb(70, 70, 70);
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 20px;
    }
</style>