<script setup>
    // defineProps({
    //     title: String,
    // })
</script>

<template>
    <div class="section">
        <div class="section-header">
            <span class="section-title">
                <slot name="title"></slot>
            </span>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style scoped>
    .section{
        padding: 0 10px;
    }

    .section-header{
        margin: 10px;

        .section-title{
            font-size: 32px;
            font-weight: bold;
        }
    }
</style>