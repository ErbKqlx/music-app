<script setup>
    defineProps({
        username: String,
    })
</script>

<template>
    <div class="top-card">
        <div class="avatar">
            <!-- <img src="" alt="Аватар"> -->
        </div>
        <span>username</span>
    </div>
</template>

<style scoped>
    .top-card{
        background-color: rgb(70, 70, 70);
        height: 15%;
        display: flex;
        gap: 20px;
        padding: 20px;

        .avatar{
            /* position: absolute; */
            border-radius: 100%;
            aspect-ratio: 1 / 1;
            min-height: 10vw;
            background-color: lightgray;
        }

        span{
            font-size: 3rem;
            font-weight: bold;
        }
    }
</style>