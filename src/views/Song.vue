<script setup>
    import router from '@/router/index.js'
    import Header from '@/components/Header.vue'
    import PlayerBar from '@/components/PlayerBar/PlayerBar.vue'
    import TitleCard from '@/components/TitleCard.vue'
    import CardsList from '@/components/CardsList.vue'
    import Image from '@/components/Image.vue'
    import Card from '@/components/Card.vue'
    import Wrapper from '@/components/Wrapper.vue'
    // import Lyrics from '@/components/Lyrics.vue'
    import { onMounted, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import http from '../http'
    import Button from '@/components/Input/Button.vue'
    import Play from '@/assets/svg/play.svg?component'
    import ThreeDotsHorizontal from '@/assets/svg/ThreeDotsHorizontal.svg?component'
    import { usePlayerStore } from '@/stores/player'
    import { useContextMenuStore } from '@/stores/contextMenu'
    import Section from '@/components/Section.vue'
    import { formatDate } from '../composables/formatDate'
    import { useModalStore } from '../stores/modal'
    import { useLyricsStore } from '../stores/lyrics'
    import { useUserStore } from '../stores/user'
    import { useToastStore } from '../stores/toast'

    const route = useRoute()

    const playerStore = usePlayerStore()
    const contextMenuStore = useContextMenuStore()
    const modalStore = useModalStore()
    const lyricsStore = useLyricsStore()
    const userStore = useUserStore()
    const toastStore = useToastStore()

    const songData = ref(null)

    function toArtist(id){
        router.push('/artist/' + id)
    }

    async function fetchSongData(id_song) {
        try{
            const song = await http.get('/song/' + id_song, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token')}
            })

            songData.value = song.data
            console.log(songData.value)

        }
        catch (error){
            console.log('Ошибка при загрузке трека ' + error)
            toastStore.show('Ошибка при загрузке трека', 'error')
        }
    }

    function startSong(song){
        playerStore.isShuffled = false
        playerStore.setQueue([song])
        
        if (playerStore.currentSong == song){
            playerStore.isPlaying? playerStore.pauseSong() : playerStore.playSong(playerStore.currentSong)
            // console.log(playerStore.currentSong)
        }
        else{
            playerStore.playSong(song)
        }
    }

    function handleMiscClick(event){
        const isOwner = userStore.currentUser?.id && 
            songData.value.data.artists?.some(artist => Number(artist.id_user) === Number(userStore.currentUser.id));

        // console.log(songData.value.data)
        // console.log(event)
        const options = [
            { 
                label: 'Добавить в плейлист', 
                action: () => {
                    modalStore.openModal('selectPlaylists', songData.value.data)
                }
            },
            { 
                label: 'Добавить в очередь', 
                action: () => {
                    playerStore.addToQueue([songData.value.data])
                    // console.log("Добавить в очередь") 
                }
            },
        ];

        if (isOwner || userStore.isModerator){
            options.push(
                { 
                    label: 'Редактировать информацию о треке', 
                    action: () => {
                        modalStore.openModal('song', songData?.value.data)
                        // console.log("Редактировать информацию о треке") 
                    }
                },
                { 
                    label: 'Удалить трек',
                    action: async () => {
                        try{
                            await http.delete(`/song/${songData?.value.data.id}`, 
                                {
                                    headers: { Authorization: "Bearer " + localStorage.getItem('token')}
                                }
                            )

                            router.push('/')
                        }
                        catch (error){
                            console.log('Ошибка при удалении трека ' + error)
                            toastStore.show('Ошибка при удалении трека', 'error')
                            
                        }
                    }, 
                    danger: true,
                },
            )
        }
        contextMenuStore.open(event, options);
    }

    function handleLyricsClick() {
        // lyricsStore.toggleLyrics()
        if (!lyricsStore.isOpen){
            lyricsStore.openLyrics(songData.value.data.lyrics, songData.value.data.artists, songData.value.data.name)
        }
        else{
            lyricsStore.closeLyrics()
        }
        
    }

    const comments = ref([])
    const newCommentText = ref('')
    const isCommentsLoading = ref(false)

    async function fetchComments(id_song) {
        try {
            isCommentsLoading.value = true
            const response = await http.get(`/song/${id_song}/comments`)
            comments.value = response.data.comments || response.data
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error)
            toastStore.show('Ошибка при загрузке комментариев', 'error')
            
            
        }

        isCommentsLoading.value = false
    }

    async function sendComment() {
        if (!newCommentText.value.trim()) return

        try {
            const payload = { text: newCommentText.value.trim() }
            const response = await http.post(`/song/${route.params.id}/comments`, payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })

            const freshComment = response.data.comment || response.data
            comments.value.unshift(freshComment) 
            newCommentText.value = ''
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error)
            toastStore.show('Ошибка при отправке комментария', 'error')
        }
    }

    async function deleteComment(commentId) {
        if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return

        try {
            await http.delete(`/comments/${commentId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            comments.value = comments.value.filter(c => c.id !== commentId)
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error)
            toastStore.show('Ошибка при удалении комментария', 'error')
            
        }
    }

    function canDeleteComment(comment) {
        if (!userStore.currentUser) return false;
        
        if (userStore.isAdmin || userStore.isModerator) return true;
        
        return Number(userStore.currentUser.id) === Number(comment.id_user);
    }

    watch(() => route.params.id, (newId) => {
        fetchSongData(newId);
        fetchComments(newId);
    });

    onMounted(async () => {
        fetchSongData(route.params.id)
        fetchComments(route.params.id)
    })


    watch(() => route.params.id, (newId) => {
        fetchSongData(newId);
    });

    onMounted(async () => {
        fetchSongData(route.params.id)
    })
</script>

<template>
    <div class="song-info">
        <TitleCard 
            type="song" 
            :title="songData?.data.name"
            :explicit-content="songData?.data.explicit_content"
        >
            <template #image>
                <img :src="songData?.data.image" alt="Обложка трека">
            </template>

            <template #metadata>
                <div class="metadata-row">
                    <div class="artists">
                        <span class="artist-link" v-for="artist in songData?.data.artists" :key="artist.id">
                            <RouterLink :to="'/artist/' + artist.id">{{ artist.name }}</RouterLink>
                        </span>
                    </div>
                    <span class="separator">•</span>

                    <span>{{ formatDate(songData?.data.release_date) }}</span>
                </div>
            </template>

            <template #actions>
                <div class="song-action-group">
                    <button 
                        class="play-btn" 
                        @click="startSong(songData?.data)"
                        :title="playerStore.isPlaying && playerStore.currentSong?.id === songData?.data.id ? 'Пауза' : 'Слушать'"
                    >
                        <span class="play-icon" v-if="playerStore.isPlaying && playerStore.currentSong?.id === songData?.data.id">
                            ❚❚
                        </span>
                        <span class="play-icon" v-else>
                            ▶
                        </span>
                    </button>

                    <button class="misc-song-btn" @click.stop="handleMiscClick" title="Больше опций">
                        <ThreeDotsHorizontal width="28" height="28"/>
                    </button>
                </div>
            </template>
        </TitleCard>
        <div class="info">
            <Section>
                <template #content>
                    <div v-if="songData?.data.genres && songData.data.genres.length > 0" class="genres-list">
                        <span 
                            v-for="genre in songData.data.genres" 
                            :key="genre.id" 
                            class="genre-badge"
                        >
                            {{ genre.name }}
                        </span>
                    </div>
                    <div v-else class="additional-info">
                        Жанры не указаны
                    </div>
                </template>
            </Section>
            
            <Section>
                <template #title>
                    Исполнители
                </template>
                <template #content>
                    <div class="artists-list">
                        <div class="artist-card" @click="toArtist(artist.id)" v-for="artist in songData?.data.artists" :key="artist.id">
                            <div class="image">
                                <Image class="round-image" :url="artist.user[0].avatar"/>
                            </div>
                            <div class="info">
                                <div class="artist-name">{{ artist.name }}</div>
                                <div class="artist-bio additional-info">{{ artist.bio || 'Нет описания'}}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </Section>

            <Section>
                <template #title>
                    Комментарии ({{ comments.length }})
                </template>
                <template #content>
                    <div class="comments-section">
                        
                        <form v-if="userStore.currentUser" @submit.prevent="sendComment" class="comment-form">
                            <textarea 
                                v-model="newCommentText" 
                                placeholder="Напишите комментарий..." 
                                rows="3" 
                                required
                            ></textarea>
                            <Button type="submit" class="btn-send-comment">Отправить</Button>
                        </form>
                        <div v-else class="auth-reminder">
                            Чтобы оставить комментарий, пожалуйста, авторизуйтесь.
                        </div>

                        <div v-if="isCommentsLoading" class="comments-loading">Загрузка комментариев...</div>

                        <div v-else-if="comments.length > 0" class="comments-list">
                            <div class="comment-item" v-for="comment in comments" :key="comment.id">
                                <div class="comment-avatar">
                                    <Image class="round-image" :url="comment.user?.avatar || comment.user_avatar" />
                                </div>
                                <div class="comment-body">
                                    <div class="comment-header">
                                        <span class="comment-author">{{ comment.user?.name || comment.user_name || 'Пользователь' }}</span>
                                        <span class="comment-date additional-info">{{ formatDate(comment.created_at) }}</span>
                                    </div>
                                    <div class="comment-text">
                                        {{ comment.text }}
                                    </div>
                                </div>
                                <div v-if="canDeleteComment(comment)" class="comment-actions">
                                    <button @click="deleteComment(comment.id)" class="btn-delete-comment">Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Section>
        </div>
    </div>
</template>

<style scoped>
    .song-info{
        /* height: 1vh; */
        flex-grow: 1;
        /* background-color: rgb(20, 20, 20); */
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: scroll;
        padding-bottom: 10px;

        .song-actions{
            display: flex;
            /* justify-content: space-between; */
            gap: 5px;
            margin-top: 10px;
            padding: 0 10px;

            .button{
                min-width: 10px;
                height: 50px;
                /* border-radius: 100%; */
                font-size: 14px;
            }

            

            .play-btn{
                border-radius: 100%;
            }
        }

        .info{
            height: 1vh;
            margin-top: 10px;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            gap: 50px;

            .albums-list{
                display: flex;
                /* gap: 50px; */
                flex-wrap: wrap;
            }

            .artists-list{
                display: flex;
                /* gap: 10px; */
                justify-content: space-between;

                .image{
                    width: 10vw;
                    align-self: center;
                }

                .artist-card{
                    display: flex;
                    gap: 10px;
                    padding: 10px;

                    .info{
                        gap: 10px;
                        flex-grow: 1;

                        .artist-name{
                            width: 100%;
                            font-size: 32px;
                            margin-bottom: 10px;
                            color: var(--text-primary);
                        }

                        .artist-bio{
                            /* flex-grow: 1; */
                            width: 100%;
                            overflow-wrap: break-word;
                            flex-grow: 1;
                            line-height: 1.6;
                        }
                    }
                }
            }

            .artists-list div{
                width: 49%;
                /* background-color: rgb(41, 41, 41); */
                border-radius: 5px;
                cursor: pointer;
            }

            .artist-card:hover{
                background-color: var(--bg-hover);
            }

            .genres-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }

            .genre-badge {
                background-color: rgba(255, 255, 255, 0.07);
                color: var(--text-primary);
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid rgba(255, 255, 255, 0.05);
                transition: all 0.2s ease;
                cursor: default;

                &:hover {
                    background-color: var(--accent-color, #4caf50);
                    color: #fff;
                    border-color: var(--accent-color, #4caf50);
                    transform: translateY(-1px);
                }
            }

            .comments-section {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 10px;
                margin-bottom: 10px;
            }

            .comment-form {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                width: 100%;

                textarea {
                    width: 100%;
                    background-color: var(--bg-primary, #121214);
                    color: var(--text-primary, #fff);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 12px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;

                    &:focus {
                        outline: none;
                        border-color: var(--accent-color, #4caf50);
                    }
                }

                .btn-send-comment {
                    background-color: var(--accent-color, #4caf50) !important;
                    color: white !important;
                    padding: 8px 20px;
                    font-size: 14px;
                    height: auto;
                    border-radius: 20px;
                }
            }

            .auth-reminder {
                color: var(--text-secondary);
                font-size: 14px;
                background: rgba(255, 255, 255, 0.03);
                padding: 15px;
                border-radius: 8px;
                text-align: center;
            }

            .comments-loading {
                text-align: center;
                color: var(--text-secondary);
                padding: 20px;
            }

            .comments-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .comment-item {
                display: flex;
                gap: 15px;
                background-color: rgba(255, 255, 255, 0.02);
                padding: 15px;
                border-radius: 8px;
                align-items: flex-start;
                transition: background-color 0.2s;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.04);
                }

                .comment-avatar {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                    
                    .round-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                }

                .comment-body {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;

                    .comment-header {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .comment-author {
                            font-weight: 600;
                            font-size: 14px;
                            color: var(--text-primary);
                        }

                        .comment-date {
                            font-size: 12px;
                            color: var(--text-secondary);
                        }
                    }

                    .comment-text {
                        font-size: 14px;
                        line-height: 1.5;
                        color: var(--text-primary);
                        white-space: pre-wrap;
                    }
                }

                .comment-actions {
                    margin-left: 10px;

                    .btn-delete-comment {
                        background: none;
                        border: none;
                        color: #f44336;
                        font-size: 12px;
                        cursor: pointer;
                        padding: 4px 8px;
                        border-radius: 4px;
                        opacity: 0.7;
                        transition: opacity 0.2s, background-color 0.2s;

                        &:hover {
                            opacity: 1;
                            background-color: rgba(244, 67, 54, 0.1);
                        }
                    }
                }
            }
        }
        
        .empty{
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
            color: var(--text-secondary);
        }
    }

    .song-action-group {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 8px;
    }

    .play-btn {
        background-color: #5577ee;
        color: white;
        border: none;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s, background-color 0.2s;
        flex-shrink: 0;

        &:hover {
            transform: scale(1.05);
            background-color: #6688ff;
        }

        &:active {
            transform: scale(0.96);
        }

        .play-icon {
            font-size: 14px;
            margin-left: 2px;
            line-height: 1;
        }

        &:has(span:contains("❚❚")) .play-icon {
            margin-left: 0;
            font-size: 16px;
        }
    }

    .misc-song-btn {
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        border-radius: 50%;
        transition: opacity 0.2s, background-color 0.2s, transform 0.2s;

        :deep(svg) {
            width: 22px !important;
            height: 22px !important;
        }

        &:hover {
            opacity: 1;
        }
        
        &:active {
            transform: scale(0.95);
        }
    }

    .metadata-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--text-primary);
        
        .separator {
            opacity: 0.6;
            user-select: none;
        }
    }

    .artist-link:not(:last-child)::after {
        content: ", ";
    }
</style>