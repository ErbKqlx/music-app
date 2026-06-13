<script setup>
    import { ref, onMounted } from 'vue'
    import http from '@/http'
    import Section from '@/components/Section.vue'
    import Image from '@/components/Image.vue'
    import { formatDate } from '@/composables/formatDate'
    import { useToastStore } from '@/stores/toast'
    import { useUserStore } from '@/stores/user'

    const toastStore = useToastStore()
    const userStore = useUserStore()

    const comments = ref([])
    const isLoading = ref(false)
    const editingCommentId = ref(null)
    const editingCommentText = ref('')

    async function fetchMyComments() {
        try {
            isLoading.value = true

            const response = await http.get('/comments/my', {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            comments.value = response.data.data
        } catch (error) {
            console.error('Ошибка при загрузке ваших комментариев:', error)
            toastStore.show('Ошибка при загрузке комментариев', 'error')
        } finally {
            isLoading.value = false
        }
    }

    async function deleteComment(commentId) {
        try {
            await http.delete(`/comments/${commentId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })
            comments.value = comments.value.filter(c => c.id !== commentId)
            toastStore.show('Комментарий удалён', 'success')
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error)
            toastStore.show('Ошибка при удалении комментария', 'error')
        }
    }

    function startEditComment(comment) {
        editingCommentId.value = comment.id
        editingCommentText.value = comment.text
    }

    function cancelEditComment() {
        editingCommentId.value = null
        editingCommentText.value = ''
    }

    async function saveUpdatedComment(commentId) {
        if (!editingCommentText.value.trim()) return

        try {
            const payload = { text: editingCommentText.value.trim() }
            const response = await http.patch(`/comments/${commentId}`, payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') }
            })

            const updatedComment = response.data.data
            if (updatedComment) {
                const index = comments.value.findIndex(c => c.id === commentId)
                if (index !== -1) {
                    const oldSongData = comments.value[index].song
                    comments.value[index] = { ...updatedComment, song: oldSongData }
                }
                cancelEditComment()
                toastStore.show('Комментарий изменён', 'success')
            }
        } catch (error) {
            console.error('Ошибка при обновлении комментария:', error)
            toastStore.show('Ошибка при изменении комментария', 'error')
        }
    }

    function isCommentEdited(comment) {
        if (!comment.created_at || !comment.updated_at) return false
        const created = new Date(comment.created_at).getTime()
        const updated = new Date(comment.updated_at).getTime()
        return (updated - created) > 1000
    }

    onMounted(() => {
        fetchMyComments()
    })
</script>

<template>
    <div class="my-comments-page">
        <Section>
            <template #title>
                Мои комментарии ({{ comments.length }})
            </template>
            <template #content>
                <div v-if="isLoading" class="loading">Загрузка ваших комментариев...</div>

                <div v-else-if="comments.length > 0" class="comments-list">
                    <div class="comment-card" v-for="comment in comments" :key="comment.id">
                        
                        <div class="song-info-fallback" v-if="comment.song">
                            <RouterLink :to="'/song/' + comment.song.id" class="song-link">
                                <div class="song-cover">
                                    <img :src="comment.song.image" alt="Обложка трека">
                                </div>
                                <div class="song-details">
                                    <span class="song-name">{{ comment.song.name }}</span>
                                    <span class="song-artists" v-if="comment.song.artists">
                                        {{ comment.song.artists.map(a => a.name).join(', ') }}
                                    </span>
                                </div>
                            </RouterLink>
                        </div>

                        <div class="comment-main">
                            <div class="comment-meta">
                                <span class="comment-date">
                                    {{ formatDate(comment.created_at, true) }}
                                    <span v-if="isCommentEdited(comment)" class="comment-edited">
                                        (изменено)
                                    </span>
                                </span>
                            </div>

                            <div v-if="editingCommentId === comment.id" class="edit-comment-form">
                                <textarea 
                                    v-model="editingCommentText" 
                                    rows="2" 
                                    required
                                ></textarea>
                                <div class="edit-actions">
                                    <button @click="saveUpdatedComment(comment.id)" class="btn-save">Сохранить</button>
                                    <button @click="cancelEditComment" class="btn-cancel">Отмена</button>
                                </div>
                            </div>

                            <div v-else class="comment-text">
                                {{ comment.text }}
                            </div>
                        </div>

                        <div class="comment-actions">
                            <button 
                                v-if="editingCommentId !== comment.id" 
                                @click="startEditComment(comment)" 
                                class="btn-edit"
                            >
                                Редактировать
                            </button>
                            <button 
                                @click="deleteComment(comment.id)" 
                                class="btn-delete"
                            >
                                Удалить
                            </button>
                        </div>

                    </div>
                </div>

                <div v-else class="empty-state">
                    Вы ещё не оставили ни одного комментария.
                </div>
            </template>
        </Section>
    </div>
</template>

<style scoped>
    .my-comments-page {
        flex-grow: 1;
        background-color: var(--bg-tertiary);
        border-radius: 10px;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
    }

    .loading, .empty-state {
        text-align: center;
        color: var(--text-secondary);
        padding: 4px;
        font-size: 16px;
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
        height: 1vh;
    }

    .comment-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        background-color: var(--bg-hover);
        padding: 16px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }

    .comment-card:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }

    .song-info-fallback {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding-bottom: 10px;
    }

    .song-link {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
        width: max-content;

        &:hover .song-name {
            color: var(--accent-color, #4caf50);
            text-decoration: underline;
        }
    }

    .song-cover {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .song-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .song-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-primary);
    }

    .song-artists {
        font-size: 12px;
        color: var(--text-secondary);
    }

    .comment-main {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .comment-meta {
        font-size: 12px;
        color: var(--text-secondary);
    }

    .comment-edited {
        font-size: 11px;
        opacity: 0.5;
        margin-left: 5px;
        font-style: italic;
    }

    .comment-text {
        font-size: 14px;
        line-height: 1.5;
        color: var(--text-primary);
        white-space: pre-wrap;
    }

    .comment-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 4px;
    }

    .btn-edit, .btn-delete {
        background: none;
        border: none;
        font-size: 12px;
        cursor: pointer;
        padding: 6px 10px;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s, background-color 0.2s;
    }

    .btn-edit {
        color: var(--text-secondary);
        &:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
        }
    }

    .btn-delete {
        color: #f44336;
        &:hover {
            opacity: 1;
            background-color: rgba(244, 67, 54, 0.1);
        }
    }

    .edit-comment-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;

        textarea {
            width: 100%;
            background-color: var(--bg-primary, #121214);
            color: var(--text-primary, #fff);
            border: 1px solid var(--accent-color, #4caf50);
            border-radius: 6px;
            padding: 10px;
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
            
            &:focus {
                outline: none;
            }
        }

        .edit-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;

            button {
                border: none;
                padding: 6px 12px;
                font-size: 12px;
                border-radius: 14px;
                cursor: pointer;
            }

            .btn-save {
                background-color: var(--accent-color, #4caf50);
                color: white;
            }

            .btn-cancel {
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }
        }
    }
</style>