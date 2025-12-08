<script setup>

</script>

<template>
    <div class="context-menu">
        <slot></slot>
    </div>
</template>

<style scoped>
    .context-menu{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>