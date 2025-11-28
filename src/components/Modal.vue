<script setup>
    import Button from '@/components/Input/Button.vue'

    defineProps({
        title: String,
        show: Boolean,
    })
    const emit = defineEmits(['close'])

    function close(){
        emit('close')
    }
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div class="modal-overlay" v-if="show" @click.self="close">
                <div class="modal-content">
                    <span class="title">{{ title }}</span>
                    <div class="main-content">
                        <slot name="image"></slot>
                        <slot name="content"></slot>
                    </div>
                    <!-- <button @click="close">Закрыть</button> -->
                    <div class="modal-actions">
                        <slot name="button"></slot>
                        <Button @click="close">Закрыть</Button>
                    </div>
                </div>
            </div>
        </Transition>
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
            border-radius: 5px;
            min-width: 30vw;
            min-height: 40vh;
            background-color: rgb(20, 20, 20);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;

            .title{
                font-size: 24px;
                font-weight: bold;
            }

            /* .fields{
                
            } */

            .main-content{
                display: flex;
                gap: 20px;
                flex-grow: 1;
            }

            /* .image{
                border-radius: 5px;
                width: 300px;
            } */

            .modal-actions{
                display: flex;
                gap: 5px;
                align-self: flex-end;
            }
            
        }
    }

    .fade-leave-active{
        transition: opacity 0.2s;
    }

    .fade-leave-to{
        opacity: 0;
    }
</style>