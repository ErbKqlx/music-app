<script setup>
    

    defineProps({
        display: {
            type: Boolean,
            default: false,
        }
    })

    function openContextMenu(e){
        this.$refs.menuu
    }
</script>

<template>
    <div class="action-bar">
        <slot></slot>
    </div>
</template>

<style scoped>
    .action-bar{
        display: flex;
        gap: 10px;

        /* .misc-button svg{
            transform: rotate(90deg);
        } */
    }
</style>