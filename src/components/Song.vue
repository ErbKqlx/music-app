<script setup>
    defineProps({
        title: String,
        artists: Array
    })
</script>

<template>
    <div class="song">
        <div class="image">
            <img src="" alt="Изображение плейлиста">
        </div>
        <div>
            <span>{{title}}</span>
            <span class="additional-info" v-for="artist in artists">{{ artist }}</span>
        </div>
    </div>
</template>

<style scoped>
    .song{
        
    }
</style>