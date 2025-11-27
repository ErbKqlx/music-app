<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import router from '@/router/index.js'
    import Modal from '@/components/Modal.vue'
    import Image from '@/components/Image.vue'
    import Form from '@/components/Form.vue'
    import { ref } from 'vue'

    // defineProps({
    //     isOpen: Boolean,
    // })

    function toPlaylist(){
        router.push('/playlist')
    }

    function resizeAside(){
        // if (){
        //     alert('closed')
        // }
        // else{
        //     alert('opened')
        // }
        // isOpen = !isOpen
    }

    const isOpen = ref(false)
</script>

<template>
    <div class="playlists-aside">
        <div class="aside-header">
            <div>
                <span>Моя музыка</span>
            </div>
            <div>
                <span @click="resizeAside" class="additional-info clickable">Свернуть</span>
                <!-- <div class="resize-button">

                </div> -->
            </div>
        </div>
        <div class="playlist-actions">
            <Button @click="isOpen = true">
                <AddPlus/>Добавить
            </Button>
            <Modal title="Создание плейлиста" :show="isOpen" @close="isOpen = false">
                <template #image>
                    <Image/>
                    <!-- <div class="image">
                        <img src="" alt="">
                    </div> -->
                </template>
                <template #content>
                    <Form></Form>
                </template>
                <template #button>
                    <Button>Создать</Button>
                </template>
            </Modal>
        </div>
        <div class="playlist-cards">
            <PlaylistCard @click="toPlaylist" title="Плейлист №1" count="1" v-for="i in 4"/>
            <!-- <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/>
            <PlaylistCard title="Плейлист №1" count="1"/> -->
        </div>
        
    </div>
</template>

<style scoped>
    .playlists-aside{
        width: 20vw;
        background-color: rgb(20, 20, 20);
        padding: 10px 10px;
        border-radius: 10px;

        .aside-header{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .playlist-actions{
            display: flex;
            margin-bottom: 10px;
        }

        .playlist-cards{
            display: flex;
            flex-direction: column;
        }
    }
</style>