<script setup>
    import PlaylistCard from './PlaylistCard.vue'
    import AddPlus from '@/assets/svg/AddPlus.svg?component'
    import Button from '@/components/Input/Button.vue?component'
    import RightArrowSvg from '@/assets/svg/rightArrow.svg?component'
    import router from '@/router/index.js'
    import { useModalStore } from '../../stores/modal'
    import { onMounted } from 'vue'
    import { usePlaylistStore } from '../../stores/playlist.js'

    const modalStore = useModalStore()
    const playlistStore = usePlaylistStore()

    const props = defineProps({
        isCollapsed: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['resize'])

    function toggleResize() {
        emit('resize')
    }

    function toPlaylist(playlist_id) {
        router.push('/playlist/' + playlist_id)
    }

    onMounted(() => {
        // console.log(playlistStore.savedPlaylists.playlists[0])
    })
</script>

<template>
    <div class="playlists-aside" :class="{ 'is-collapsed': isCollapsed }">
        <div class="aside-header">
            <div class="header-title" v-if="!isCollapsed">
                <span class="title-text">Моя медиатека</span>
                <span class="counter-badge" v-if="playlistStore.savedPlaylists?.playlists.length > 0">{{ playlistStore.savedPlaylists.playlists.length }}</span>
            </div>
            
            <div class="header-actions">
                <button v-if="!isCollapsed" @click="toggleResize" class="text-action-btn">
                    Свернуть
                </button>
                <Button v-else @click="toggleResize" class="no-background round-button collapse-toggle-btn">
                    <RightArrowSvg color="var(--text-secondary)"/>
                </Button>
            </div>
        </div>

        <div class="cards-container scrollable-element" v-if="playlistStore.savedPlaylists?.playlists.length > 0">
            <div 
                v-for="playlist in playlistStore.savedPlaylists.playlists" 
                :key="playlist.id"
                @click="toPlaylist(playlist.id)" 
                class="aside-playlist-card"
            >
                <img 
                    :src="playlist.image" 
                    :alt="playlist.name"
                    class="playlist-image"
                />
                
                <div class="playlist-info">
                    <p class="playlist-title">{{ playlist.name }}</p>
                    <span class="playlist-count">Плейлист • {{playlist.songs_count}}</span>
                </div>
            </div>
        </div>

        <div class="empty-state" v-else-if="!isCollapsed">
            <div class="empty-content">
                <p class="empty-title">Создайте свой первый плейлист</p>
            </div>
        </div>

        <div class="playlist-actions">
            <Button @click="modalStore.openModal('playlist')" class="btn-add-playlist">
                <AddPlus class="icon-plus"/> 
                <span class="btn-text" v-if="!isCollapsed">Создать плейлист</span>
            </Button>
        </div>
    </div>
</template>

<style scoped>
    .playlists-aside {
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

        width: 350px;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .playlists-aside.is-collapsed {
        width: 72px;
        padding: 16px 8px;

        .aside-header {
            justify-content: center;
        }

        .cards-container {
            align-items: center;
            overflow-x: hidden;

            .aside-playlist-card {
                padding: 4px;
                width: 100%;
                display: flex;
                justify-content: center;

                .playlist-info {
                    display: none !important;
                }

                .playlist-image {
                    width: 48px !important;
                    height: 48px !important;
                    min-width: 48px !important;
                    max-width: 48px !important;
                    object-fit: cover;
                    border-radius: 8px;
                    margin: 0 !important;
                }
            }
        }

        .playlist-actions {
            border-top: none;
            padding-top: 0;
            
            .btn-add-playlist {
                width: 48px;
                height: 48px;
                min-width: 48px;
                border-radius: 50%;
                padding: 0;
                justify-content: center;
                
                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }

    .aside-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 32px;
        flex-shrink: 0;
        
        .header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            animation: fadeIn 0.2s ease; 

            .title-text {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary, #fff);
                letter-spacing: -0.2px;
                white-space: nowrap;
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

            .text-action-btn {
                background: none;
                border: none;
                font-size: 13px;
                color: var(--text-secondary, #b3b3b3);
                cursor: pointer;
                font-weight: 500;
                transition: color 0.2s;
                white-space: nowrap;

                &:hover { color: var(--text-primary, #fff); }
            }
            
            .collapse-toggle-btn {
                animation: fadeIn 0.2s ease;
            }
        }
    }

    .cards-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 2px;
    }

    .aside-playlist-card {
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 8px;
        transition: background-color 0.2s ease;
        padding: 8px;
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;

        &:hover {
            background-color: var(--bg-hover, rgba(255, 255, 255, 0.04));
        }

        .playlist-image {
            width: 72px;
            height: 72px;
            object-fit: cover;
            border-radius: 6px;
            flex-shrink: 0;
        }

        .playlist-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            overflow: hidden;

            .playlist-title {
                font-size: 18px;
                font-weight: 500;
                color: var(--text-primary, #fff);
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .playlist-count {
                font-size: 12px;
                color: var(--text-secondary, #b3b3b3);
                margin: 0;
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
        flex-shrink: 0;

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
            white-space: nowrap;
            
            &:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .icon-plus {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
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

        .empty-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #fff);
            margin: 0;
        }
    }

    .scrollable-element {
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-track { background: transparent; }
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>