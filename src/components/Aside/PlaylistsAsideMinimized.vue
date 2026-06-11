<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import router from '@/router/index.js'
    import RightArrowSvg from '@/assets/svg/rightArrow.svg?component'
    import { useModalStore } from '../../stores/modal'

    const modalStore = useModalStore()

    const props = defineProps({
        playlists: {
            type: Array,
            default: () => []
        },
    })

    const emit = defineEmits(['resize'])

    function resize(){
        emit('resize')
    }

    function toPlaylist(playlist_id){
        router.push('/playlist/' + playlist_id)
    }
</script>

<template>
    <div class="playlists-aside-collapsed">
        <div class="aside-header">
            <Button @click="resize" class="no-background round-button">
                <RightArrowSvg color="var(--text-secondary)"/>
            </Button>
        </div>

        <div class="playlist-cards scrollable-element" v-if="props.playlists.length > 0">
            <PlaylistCard 
                @click="toPlaylist(playlist.id)" 
                :title="playlist.name" 
                count="1" 
                v-for="playlist in props.playlists" 
                :key="playlist.id"
                :image_url="playlist.image"
                class="collapsed-card"
            />
        </div>

        <div class="playlist-actions">
            <Button class="round-button btn-add-playlist" @click="modalStore.openModal('playlist')">
                <AddPlus/>
            </Button>
        </div>
    </div>
</template>

<style scoped>
    .playlists-aside-collapsed {
        width: 72px; 
        min-width: 72px;
        max-width: 72px;
        
        height: 100%;
        max-height: calc(100vh - 150px); 
        background-color: var(--bg-tertiary, #121214);
        padding: 16px 8px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-sizing: border-box;
        
        flex-shrink: 0;
        overflow: hidden;

        .aside-header {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .playlist-cards {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex-grow: 1;
            overflow-y: auto;
            overflow-x: hidden;
            align-items: center;

            .collapsed-card {
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 4px;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.2s;

                &:hover {
                    background-color: var(--bg-hover, rgba(255, 255, 255, 0.04));
                }

                :deep(.playlist-info) {
                    display: none !important;
                }
                
                :deep(img), :deep(.playlist-image) {
                    width: 48px;
                    height: 48px;
                    object-fit: cover;
                    border-radius: 6px;
                    flex-shrink: 0;
                }
            }
        }

        .playlist-actions {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.03);

            .btn-add-playlist {
                width: 48px;
                height: 48px;
                min-width: 48px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.05) !important;
                color: var(--text-primary, #fff) !important;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                transition: all 0.2s ease;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    transform: scale(1.04);
                }
            }
        }

        .scrollable-element {
            &::-webkit-scrollbar {
                width: 4px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 2px;
            }
        }
    }
</style>