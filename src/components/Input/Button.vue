<script setup>
    // defineProps({
    //     value: String,
    // })
</script>

<template>
    <button>
        <slot></slot>
    </button>
</template>

<style scoped>
    button{
        padding: 10px;
        /* min-width: 50px; */
        /* height: 25px; */
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button:hover{
        background-color: lightgray;
        cursor: pointer;
    }

    button:active{
        background-color: gray;
    }
</style>