<script setup>
    import Button from '@/components/Input/Button.vue'

    defineProps({
        show: Boolean,
    })
    const emit = defineEmits(['close'])

    function close(){
        emit('close')
    }
</script>

<template>
    <Teleport to="body">
        <div class="modal-overlay" v-if="show" @click.self="close">
            <div class="modal-content">
                <slot></slot>
                <!-- <button @click="close">Закрыть</button> -->
                <Button @click="close">Закрыть</Button>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
    .modal-overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;

        .modal-content{
            width: 30vw;
            height: 20vh;
            background-color: rgb(20, 20, 20);
        }
    }
</style>