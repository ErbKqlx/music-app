<script setup>
    defineProps({
        text: String
    })
</script>

<template>
    <input type="submit">
</template>

<style scoped>
    input[type='submit']{
        height: 40px;
        font-weight: bold;
        font-size: 14px;
    }

    input[type='submit']:hover{
        cursor: pointer;
        background-color: rgb(140, 140, 140);
    }
</style>