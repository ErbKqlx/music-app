<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import router from '@/router/index.js'
    // import Modal from '@/components/Modal.vue'
    import Image from '@/components/Image.vue'
    import Form from '@/components/Form.vue'
    import Input from '@/components/Input/Input.vue'
    import { ref } from 'vue'


    const props = defineProps({
        playlists: {
            
        },
    })

    const emit = defineEmits(
        ['resize']
    )

    function resize(){
        emit('resize')
    }

    function toPlaylist(playlist_id){
        router.push('/playlist/' + playlist_id)
    }

    const isModalOpen = ref(false)
</script>

<template>
    <div class="playlists-aside">
        <div class="aside-header">
            <div>
                <span>Мои плейлисты</span>
            </div>
            <div>
                <span @click="resize" class="additional-info clickable">Свернуть</span>
            </div>
        </div>
        <div class="playlist-cards">
            <PlaylistCard @click="toPlaylist(playlist.id)" 
                :title="playlist.name" 
                count="1" 
                v-for="playlist in props.playlists" 
                :key="playlist.id"
                :image_url="playlist.image"/>
        </div>
        <div class="playlist-actions">
            <Button @click="isModalOpen = true">
                <AddPlus/>Добавить
            </Button>
        </div>
    </div>
</template>

<style scoped>
    .playlists-aside{
        /* width: 20vw; */
        /* background-color: rgb(20, 20, 20); */
        height: 100%;
        background-color: var(--primary-color);
        padding: 10px 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .aside-header{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            /* margin-bottom: 10px; */
        }

        .playlist-cards{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
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