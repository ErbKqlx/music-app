<script setup>
    defineProps({
        title: String,
    })
</script>

<template>
    <div class="cards-list">
        <div class="list-header">
            <span class="list-title">{{ title }}</span>
        </div>
        <div class="list">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .list-header{
        margin-bottom: 20px;

        .list-title{
            font-size: 32px;
            font-weight: bold;
        }
    }

    .list{
        display: flex;
        /* gap: 50px; */
    }
</style>