<script setup>
    defineProps({
        name: String,
    })
</script>

<template>
    <div class="playlist-card">
        <div class="playlist-image">

        </div>
        <div class="playlist-info">
            <span>{{ name }}</span>      
        </div>
    </div>
</template>

<style scoped>
    
</style>