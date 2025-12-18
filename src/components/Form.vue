<script setup>
    import Input from '@/components/Input/Input.vue'
</script>

<template>
    <form>
        <div class="fields">
            <slot></slot>
        </div>
    </form>
</template>

<style scoped>
    form{
        width: 100%;
    }

    .fields :deep(div){
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        margin-bottom: 20px;
    }
</style>