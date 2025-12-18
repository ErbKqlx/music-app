<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import router from '@/router/index.js'
    import Modal from '@/components/Modal.vue'
    import Image from '@/components/Image.vue'
    import Form from '@/components/Form.vue'
    import Input from '@/components/Input/Input.vue'
    import RightArrowSvg from '@/assets/svg/rightArrow.svg?component'
    import { ref } from 'vue'

    const emit = defineEmits(
        ['resize']
    )

    function resize(){
        emit('resize')
    }

    function toPlaylist(){
        router.push('/playlist')
    }

    const isModalOpen = ref(false)
</script>

<template>
    <div class="playlists-aside">
        <div class="aside-header">
            <div>
                <Button @click="resize" class="no-background round-button">
                    <RightArrowSvg/>
                </Button>
                <!-- <span @click="resize" class="additional-info clickable">Развернуть</span> -->
            </div>
        </div>
        <div class="playlist-cards">
            <PlaylistCard @click="toPlaylist" title="Плейлист №1" count="1" v-for="i in 4"/>
        </div>
        <div class="playlist-actions">
            <Button class="round-button" @click="isModalOpen = true">
                <AddPlus/>
            </Button>
            <Modal title="Создание плейлиста" :show="isModalOpen" @close="isModalOpen = false">
                <template #image>
                    <Image/>
                    <!-- <div class="image">
                        <img src="" alt="">
                    </div> -->
                </template>
                <template #content>
                    <Form>
                        <div>
                            <label for="name">Название</label>
                            <Input type="text" id="name" name="name"/>
                        </div>
                        <div>
                            <label for="public">Открытый</label>
                            <input type="checkbox" name="public" id="public">
                        </div>
                    </Form>
                </template>
                <template #button>
                    <Button>Создать</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>

<style scoped>
    .playlists-aside{
        /* width: 7vw; */
        /* background-color: rgb(20, 20, 20); */
        /* max-width: 85px; */
        height: 100%;
        background-color: var(--primary-color);
        padding: 10px 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .aside-header{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            /* margin-bottom: 10px; */
        }

        .playlist-cards{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .playlist-cards :deep(.playlist-info){
            display: none;
        }

        .playlist-actions{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            /* margin-bottom: 10px; */
            padding-bottom: 10px;
        }
    }
</style>