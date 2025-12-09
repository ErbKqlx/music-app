<script setup>
    
</script>

<template>
    <button>
        <span>
            <slot></slot>
            <!-- svg компонент -->
        </span>
    </button>
</template>

<style scoped>
    button{
        display: flex;
        justify-content: center;
        align-items: center;

        span{
            
        }
    }
</style>