<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import router from '@/router/index.js'
    import Image from '@/components/Image.vue'
    import Form from '@/components/Form.vue'
    import Input from '@/components/Input/Input.vue'
    import { onMounted } from 'vue'
    import { useModalStore } from '../../stores/modal'

    const modalStore = useModalStore()

    const props = defineProps({
        playlists: {
            type: Array,
            default: () => []
        },
        count: Number,
    })

    const emit = defineEmits(['resize'])

    function resize(){
        emit('resize')
    }

    function toPlaylist(playlist_id){
        router.push('/playlist/' + playlist_id)
    }

    onMounted(() => {
        console.log(props.count)
    })
</script>

<template>
    <div class="playlists-aside">
        <div class="aside-header">
            <div class="header-title">
                <span class="title-text">Моя медиатека</span>
                <span class="counter-badge" v-if="props.count > 0">{{ props.count }}</span>
            </div>
            <div class="header-actions">
                <button @click="resize" class="text-action-btn">
                    Свернуть
                </button>
            </div>
        </div>

        <div class="cards-container scrollable-element" v-if="props.count > 0">
            <PlaylistCard 
                @click="toPlaylist(playlist.id)" 
                :title="playlist.name"
                :count="1" 
                v-for="playlist in props.playlists" 
                :key="playlist.id"
                :image_url="playlist.image"
                class="aside-playlist-card"
            />
        </div>

        <div class="empty-state" v-else>
            <div class="empty-content">
                <p class="empty-title">Создайте свой первый плейлист</p>
            </div>
        </div>

        <div class="playlist-actions">
            <Button @click="modalStore.openModal('playlist')" class="btn-add-playlist">
                <AddPlus class="icon-plus"/> Создать плейлист
            </Button>
        </div>
    </div>
</template>

<style scoped>
    .playlists-aside {
        height: 100%;
        max-height: calc(100vh - 150px); 
        background-color: var(--bg-tertiary, #121214);
        padding: 16px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-sizing: border-box;
        
        flex-shrink: 0;
        overflow: hidden;

        .aside-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .header-title {
                display: flex;
                align-items: center;
                gap: 8px;

                .title-text {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-primary, #fff);
                    letter-spacing: -0.2px;
                }

                .counter-badge {
                    background-color: rgba(255, 255, 255, 0.06);
                    color: var(--text-secondary, #b3b3b3);
                    font-size: 11px;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 600;
                }
            }

            .header-actions {
                display: flex;
                align-items: center;
                gap: 12px;

                .icon-button {
                    background: none;
                    border: none;
                    padding: 6px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s, transform 0.2s;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.05);
                        svg { color: var(--text-primary) !important; }
                    }
                    
                    &:active {
                        transform: scale(0.95);
                    }
                }

                .text-action-btn {
                    background: none;
                    border: none;
                    font-size: 13px;
                    color: var(--text-secondary, #b3b3b3);
                    cursor: pointer;
                    font-weight: 500;
                    transition: color 0.2s;

                    &:hover {
                        color: var(--text-primary, #fff);
                    }
                }
            }
        }

        .cards-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex-grow: 1;
            overflow-y: auto;
            padding-right: 4px;

            .aside-playlist-card {
                border-radius: 8px;
                transition: background-color 0.2s ease;
                padding: 8px;
                cursor: pointer;

                &:hover {
                    background-color: var(--bg-hover, rgba(255, 255, 255, 0.04));
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
            width: 100%;
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: var(--text-primary, #fff) !important;
            border: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 13px;
            font-weight: 600;
            padding: 10px 16px;
            border-radius: 8px;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                border-color: rgba(255, 255, 255, 0.1);
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }

            .icon-plus {
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
            }
        }
    }

        .empty-state {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.01);
            border: 1px dashed rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            padding: 20px;
            text-align: center;

            .empty-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;

                .empty-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary, #fff);
                    margin: 0;
                }

                .empty-subtitle {
                    font-size: 12px;
                    color: var(--text-secondary, #b3b3b3);
                    margin: 0;
                }
            }
        }

        .scrollable-element {
            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        }
    }
</style>