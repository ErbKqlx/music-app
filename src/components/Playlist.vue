<script setup>
    defineProps({
        title: String,
        count: Number
    })
</script>

<template>
    <div class="playlist">
        <div class="image">
            <img src="" alt="Изображение плейлиста">
        </div>
        <div>
            <span>{{title}}</span>
            <span class="additional-info">{{count}} трек</span>
        </div>
    </div>
</template>

<style scoped>

</style>