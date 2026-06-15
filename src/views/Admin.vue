<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import http from '../http'
    import { useToastStore } from '../stores/toast'
    import { formatDate } from '@/composables/formatDate';
    import { useUserStore } from '../stores/user';

    const toastStore = useToastStore()
    const userStore = useUserStore()

    const currentTab = ref('users')
    const isLoading = ref(false)

    const itemsPerPage = 7

    const genres = ref([])
    const genreForm = ref({ id: null, name: '' })
    const isEditingGenre = ref(false)
    const genresCurrentPage = ref(1)
    const genresSearchQuery = ref('')

    const users = ref([])
    const availableRoles = ref([])
    const usersCurrentPage = ref(1)
    const usersSearchQuery = ref('')

    const reportTypes = ref([])
    const reportTypeForm = ref({ id: null, name: '' })
    const isEditingReportType = ref(false)
    const reportTypesCurrentPage = ref(1)
    const reportTypesSearchQuery = ref('')

    const commentReports = ref([])
    const commentReportsCurrentPage = ref(1)
    const commentReportsSearchQuery = ref('')

    const artistApplications = ref([])
    const artistApplicationsCurrentPage = ref(1)
    const artistApplicationsSearchQuery = ref('')

    watch(currentTab, () => {
        genresCurrentPage.value = 1
        usersCurrentPage.value = 1
        reportTypesCurrentPage.value = 1
        commentReportsCurrentPage.value = 1
        artistApplicationsCurrentPage.value = 1
        
        genresSearchQuery.value = ''
        usersSearchQuery.value = ''
        reportTypesSearchQuery.value = ''
        commentReportsSearchQuery.value = ''
        artistApplicationsSearchQuery.value = ''
    })

    watch(genresSearchQuery, () => genresCurrentPage.value = 1)
    watch(usersSearchQuery, () => usersCurrentPage.value = 1)
    watch(reportTypesSearchQuery, () => reportTypesCurrentPage.value = 1)
    watch(commentReportsSearchQuery, () => commentReportsCurrentPage.value = 1)
    watch(artistApplicationsSearchQuery, () => artistApplicationsCurrentPage.value = 1)

    const getAuthConfig = () => ({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    const filteredGenres = computed(() => {
        if (!genresSearchQuery.value.trim()) return genres.value
        const query = genresSearchQuery.value.toLowerCase().trim()
        return genres.value.filter(genre => genre.name.toLowerCase().includes(query))
    })

    const filteredUsers = computed(() => {
        const currentUserId = userStore.currentUser?.id
        let result = users.value
        if (currentUserId) {
            result = result.filter(user => String(user.id) !== String(currentUserId))
        }
        if (!usersSearchQuery.value.trim()) return result
        const query = usersSearchQuery.value.toLowerCase().trim()
        return result.filter(user => 
            (user.username && user.username.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query))
        )
    })

    const filteredReportTypes = computed(() => {
        if (!reportTypesSearchQuery.value.trim()) return reportTypes.value
        const query = reportTypesSearchQuery.value.toLowerCase().trim()
        return reportTypes.value.filter(type => type.name.toLowerCase().includes(query))
    })

    const filteredCommentReports = computed(() => {
        if (!commentReportsSearchQuery.value.trim()) return commentReports.value
        const query = commentReportsSearchQuery.value.toLowerCase().trim()
        return commentReports.value.filter(report => 
            (report.comment?.text && report.comment.text.toLowerCase().includes(query)) ||
            (report.user?.username && report.user.username.toLowerCase().includes(query)) ||
            (report.reportType?.name && report.reportType.name.toLowerCase().includes(query))
        )
    })

    const filteredArtistApplications = computed(() => {
        if (!artistApplicationsSearchQuery.value.trim()) return artistApplications.value
        const query = artistApplicationsSearchQuery.value.toLowerCase().trim()
        return artistApplications.value.filter(app => 
            (app.User?.username && app.User.username.toLowerCase().includes(query)) ||
            (app.stage_name && app.stage_name.toLowerCase().includes(query))
        )
    })

    const totalGenresPages = computed(() => Math.ceil(filteredGenres.value.length / itemsPerPage))
    const paginatedGenres = computed(() => {
        const start = (genresCurrentPage.value - 1) * itemsPerPage
        return filteredGenres.value.slice(start, start + itemsPerPage)
    })

    const totalUsersPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
    const paginatedUsers = computed(() => {
        const start = (usersCurrentPage.value - 1) * itemsPerPage
        return filteredUsers.value.slice(start, start + itemsPerPage)
    })

    const totalReportTypesPages = computed(() => Math.ceil(filteredReportTypes.value.length / itemsPerPage))
    const paginatedReportTypes = computed(() => {
        const start = (reportTypesCurrentPage.value - 1) * itemsPerPage
        return filteredReportTypes.value.slice(start, start + itemsPerPage)
    })

    const totalCommentReportsPages = computed(() => Math.ceil(filteredCommentReports.value.length / itemsPerPage))
    const paginatedCommentReports = computed(() => {
        const start = (commentReportsCurrentPage.value - 1) * itemsPerPage
        return filteredCommentReports.value.slice(start, start + itemsPerPage)
    })

    const totalArtistApplicationsPages = computed(() => Math.ceil(filteredArtistApplications.value.length / itemsPerPage))
    const paginatedArtistApplications = computed(() => {
        const start = (artistApplicationsCurrentPage.value - 1) * itemsPerPage
        return filteredArtistApplications.value.slice(start, start + itemsPerPage)
    })

    const fetchGenres = async () => {
        try {
            isLoading.value = true
            const response = await http.get('/genres', getAuthConfig())
            genres.value = response.data.data || response.data
        } catch (error) {
            console.error('Ошибка при загрузке жанров:', error)
            toastStore.show('Не удалось загрузить жанры', 'error')
        } finally { isLoading.value = false }
    }

    const fetchUsers = async () => {
        try {
            isLoading.value = true
            const response = await http.get('/users', getAuthConfig())
            users.value = response.data.data || response.data
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error)
            toastStore.show('Не удалось загрузить пользователей', 'error')
        } finally { isLoading.value = false }
    }

    const fetchRoles = async () => {
        try {
            const response = await http.get('/roles', getAuthConfig())
            availableRoles.value = response.data.data
        } catch (error) {
            console.error('Ошибка при загрузке ролей:', error)
            toastStore.show('Не удалось загрузить список ролей', 'error')
        }
    }

    const fetchReportTypes = async () => {
        try {
            isLoading.value = true
            const response = await http.get('/report-types', getAuthConfig())
            reportTypes.value = response.data.data || response.data
        } catch (error) {
            console.error('Ошибка при загрузке типов жалоб:', error)
            toastStore.show('Не удалось загрузить типы жалоб', 'error')
        } finally { isLoading.value = false }
    }

    const fetchCommentReports = async () => {
        try {
            isLoading.value = true
            const response = await http.get('/reports/comments', getAuthConfig())
            commentReports.value = response.data.data || response.data
        } catch (error) {
            console.error('Ошибка при загрузке жалоб:', error)
            toastStore.show('Не удалось загрузить жалобы на комментарии', 'error')
        } finally { isLoading.value = false }
    }

    const fetchArtistApplications = async () => {
        try {
            isLoading.value = true
            const response = await http.get('/artist-requests', getAuthConfig())
            artistApplications.value = response.data.data || response.data
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error)
            toastStore.show('Не удалось загрузить заявки исполнителей', 'error')
        } finally { isLoading.value = false }
    }

    const saveGenre = async () => {
        if (!genreForm.value.name.trim()) return
        try {
            isLoading.value = true
            const payload = { name: genreForm.value.name.trim() }
            if (isEditingGenre.value) {
                const response = await http.patch(`/genres/${genreForm.value.id}`, payload, getAuthConfig())
                const index = genres.value.findIndex(g => g.id === genreForm.value.id)
                if (index !== -1) genres.value[index] = response.data.data || response.data
                toastStore.show(`Жанр обновлен`, 'success')
            } else {
                const response = await http.post('/genres', payload, getAuthConfig())
                genres.value.push(response.data.data || response.data)
                genresCurrentPage.value = Math.ceil(genres.value.length / itemsPerPage)
                toastStore.show(`Жанр добавлен`, 'success')
            }
            resetGenreForm()
        } catch (error) {
            toastStore.show(`Ошибка сохранения жанра: ${error.response?.data?.message || error.message}`, 'error')
        } finally { isLoading.value = false }
    }

    const deleteGenre = async (id) => {
        try {
            isLoading.value = true
            await http.delete(`/genres/${id}`, getAuthConfig())
            genres.value = genres.value.filter(g => g.id !== id)
            if (genresCurrentPage.value > totalGenresPages.value && genresCurrentPage.value > 1) genresCurrentPage.value--
            toastStore.show(`Жанр удален`, 'success')
        } catch (error) {
            toastStore.show('Ошибка при удалении жанра', 'error')
        } finally { isLoading.value = false }
    }

    const editGenre = (genre) => { genreForm.value = { ...genre }; isEditingGenre.value = true }
    const resetGenreForm = () => { genreForm.value = { id: null, name: '' }; isEditingGenre.value = false }

    const saveReportType = async () => {
        if (!reportTypeForm.value.name.trim()) return
        try {
            isLoading.value = true
            const payload = { name: reportTypeForm.value.name.trim() }
            if (isEditingReportType.value) {
                const response = await http.patch(`/report-types/${reportTypeForm.value.id}`, payload, getAuthConfig())
                const index = reportTypes.value.findIndex(r => r.id === reportTypeForm.value.id)
                if (index !== -1) reportTypes.value[index] = response.data.data || response.data
                toastStore.show(`Тип жалобы обновлен`, 'success')
            } else {
                const response = await http.post('/report-types', payload, getAuthConfig())
                reportTypes.value.push(response.data.data || response.data)
                reportTypesCurrentPage.value = Math.ceil(reportTypes.value.length / itemsPerPage)
                toastStore.show(`Тип жалобы добавлен`, 'success')
            }
            resetReportTypeForm()
        } catch (error) {
            toastStore.show(`Ошибка сохранения: ${error.response?.data?.message || error.message}`, 'error')
        } finally { isLoading.value = false }
    }

    const deleteReportType = async (id) => {
        try {
            isLoading.value = true
            await http.delete(`/report-types/${id}`, getAuthConfig())
            reportTypes.value = reportTypes.value.filter(r => r.id !== id)
            if (reportTypesCurrentPage.value > totalReportTypesPages.value && reportTypesCurrentPage.value > 1) reportTypesCurrentPage.value--
            toastStore.show(`Тип жалобы удален`, 'success')
        } catch (error) {
            toastStore.show(error.response?.data?.message || 'Ошибка при удалении типа жалобы', 'error')
        } finally { isLoading.value = false }
    }

    const editReportType = (type) => { reportTypeForm.value = { ...type }; isEditingReportType.value = true }
    const resetReportTypeForm = () => { reportTypeForm.value = { id: null, name: '' }; isEditingReportType.value = false }

    const updateUserRole = async (userId, newRoleId) => {
        const user = users.value.find(u => u.id === userId)
        if (!user) return
        try {
            isLoading.value = true
            await http.patch(`/users/${userId}/role`, { id_role: newRoleId }, getAuthConfig())
            const roleName = availableRoles.value.find(r => r.id === newRoleId)?.name || 'Новая роль'
            toastStore.show(`Роль пользователя ${user.username} изменена на "${roleName}"`, 'success')
        } catch (error) {
            await fetchUsers()
            toastStore.show(error.response?.data?.message || 'Не удалось обновить роль', 'error')
        } finally { isLoading.value = false }
    }

    const toggleUserBan = async (user) => {
        const newBanStatus = !user.is_banned;
        const actionWord = newBanStatus ? 'заблокировать' : 'разблокировать';

        try {
            isLoading.value = true;
            const response = await http.patch(`/users/${user.id}/ban`, { is_banned: newBanStatus }, getAuthConfig());
            
            const foundUser = users.value.find(u => u.id === user.id);
            if (foundUser) {
                foundUser.is_banned = newBanStatus;
            }
            
            toastStore.show(`Пользователь ${newBanStatus ? 'забанен' : 'разбанен'}`, 'success');
        } catch (error) {
            console.error(error);
            toastStore.show(error.response?.data?.message || 'Не удалось изменить статус блокировки', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    const handleReportAction = async (reportId, statusId) => {
        try {
            isLoading.value = true

            const response = await http.patch(`/reports/${reportId}/status`, { id_status: statusId }, getAuthConfig())
            
            const index = commentReports.value.findIndex(r => r.id === reportId)
            if (index !== -1) {
                commentReports.value[index] = response.data.data
            }
            
            toastStore.show('Статус жалобы обновлен', 'success')
        } catch (error) {
            console.error(error)
            toastStore.show(error.response?.data?.message || 'Не удалось обработать жалобу', 'error')
        } finally { isLoading.value = false }
    }

    const deleteReviewedReports = async () => {
        try {
            isLoading.value = true
            await http.delete('/reports/reviewed', getAuthConfig())
            
            commentReports.value = commentReports.value.filter(report => 
                report.reportStatus?.name === 'В ожидании'
            )
            
            toastStore.show('История рассмотренных жалоб очищена', 'success')
        } catch (error) {
            console.error(error)
            toastStore.show(error.response?.data?.message || 'Не удалось удалить жалобы', 'error')
        } finally {
            isLoading.value = false
        }
    }

    const handleApplicationAction = async (applicationId, status) => {
        try {
            isLoading.value = true
            await http.patch(`/artist-applications/${applicationId}`, { status }, getAuthConfig())
            const index = artistApplications.value.findIndex(a => a.id === applicationId)
            if (index !== -1) {
                artistApplications.value[index].status = status
            }
            toastStore.show(status === 'accepted' ? 'Заявка одобрена! Права обновлены.' : 'Заявка отклонена', 'success')
            await fetchUsers()
        } catch (error) {
            toastStore.show('Не удалось изменить статус заявки', 'error')
        } finally { isLoading.value = false }
    }

    onMounted(() => {
        fetchGenres()
        fetchUsers()
        fetchRoles()
        fetchReportTypes()
        fetchCommentReports()
        fetchArtistApplications()
    })
</script>

<template>
    <div class="admin-panel">
        <div class="admin-nav">
            <button :class="{ active: currentTab === 'users' }" @click="currentTab = 'users'">
                Пользователи
            </button>
            
            <button :class="{ active: currentTab === 'comment-reports' }" @click="currentTab = 'comment-reports'">
                Жалобы на комментарии
            </button>

            <button :class="{ active: currentTab === 'artist-apps' }" @click="currentTab = 'artist-apps'">
                Заявки исполнителей
            </button>

            <template v-if="userStore.isAdmin">
                <button :class="{ active: currentTab === 'genres' }" @click="currentTab = 'genres'">
                    Жанры
                </button>
                <button :class="{ active: currentTab === 'reports' }" @click="currentTab = 'reports'">
                    Типы жалоб
                </button>
            </template>
        </div>

        <div v-if="isLoading" class="loader">Загрузка данных...</div>

        <div v-else class="info-content">
            <div v-if="currentTab === 'genres'" class="tab-content">
                <h2>Жанры</h2>

                <div class="genres-management-header">
                    <form @submit.prevent="saveGenre" class="genre-form">
                        <input v-model="genreForm.name" type="text" placeholder="Название жанра" required />
                        <button type="submit" class="btn-primary" :disabled="isLoading">
                            {{ isEditingGenre ? 'Сохранить' : 'Добавить жанр' }}
                        </button>
                        <button v-if="isEditingGenre" type="button" @click="resetGenreForm" class="btn-secondary">
                            Отмена
                        </button>
                    </form>

                    <div class="search-wrapper">
                        <input v-model="genresSearchQuery" type="text" placeholder="Поиск жанра..." class="search-input"/>
                        <button v-if="genresSearchQuery" @click="genresSearchQuery = ''" class="btn-clear-search" type="button">&times;</button>
                    </div>
                </div>

                <div v-if="totalGenresPages > 1" class="pagination">
                    <button :disabled="genresCurrentPage === 1" @click="genresCurrentPage--" class="btn-page">&laquo;</button>
                    <button v-for="page in totalGenresPages" :key="page" :class="{ active: genresCurrentPage === page }" @click="genresCurrentPage = page" class="btn-page">{{ page }}</button>
                    <button :disabled="genresCurrentPage === totalGenresPages" @click="genresCurrentPage++" class="btn-page">&raquo;</button>
                </div>

                <table class="admin-table" v-if="filteredGenres.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th class="actions-th">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="genre in paginatedGenres" :key="genre.id">
                            <td>{{ genre.id }}</td>
                            <td>{{ genre.name }}</td>
                            <td class="actions-td">
                                <button @click="editGenre(genre)" class="btn-edit">Редактировать</button>
                                <button @click="deleteGenre(genre.id)" class="btn-delete" :disabled="isLoading">Удалить</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-data">Ничего не найдено.</div>
            </div>

            <div v-if="currentTab === 'users'" class="tab-content">
                <h2>Пользователи</h2>
                <div class="users-management-header">
                    <div class="header-spacer"></div>
                    <div class="search-wrapper">
                        <input v-model="usersSearchQuery" type="text" placeholder="Поиск по нику или email..." class="search-input" />
                        <button v-if="usersSearchQuery" @click="usersSearchQuery = ''" class="btn-clear-search" type="button">&times;</button>
                    </div>
                </div>

                <div v-if="totalUsersPages > 1" class="pagination">
                    <button :disabled="usersCurrentPage === 1" @click="usersCurrentPage--" class="btn-page">&laquo;</button>
                    <button v-for="page in totalUsersPages" :key="page" :class="{ active: usersCurrentPage === page }" @click="usersCurrentPage = page" class="btn-page">{{ page }}</button>
                    <button :disabled="usersCurrentPage === totalUsersPages" @click="usersCurrentPage++" class="btn-page">&raquo;</button>
                </div>

                <table class="admin-table" v-if="filteredUsers.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Никнейм</th>
                            <th>Email</th>
                            <th>Пароль</th>
                            <th>Дата регистрации</th>
                            <th>Активирован</th>
                            <th v-if="userStore.isAdmin">Роль</th>
                            <th>Статус</th>
                            <th class="actions-th">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in paginatedUsers" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td><span class="user-username">{{ user.username }}</span></td>
                            <td>{{ user.email }}</td>
                            <td><span class="password-shield">••••••</span></td>
                            <td>{{ formatDate(user.registration_date) }}</td>
                            <td><span :class="['status-badge', user.isActivated ? 'status-active' : 'status-inactive']">{{ user.isActivated ? 'Да' : 'Нет' }}</span></td>
                            <td v-if="userStore.isAdmin">
                                <select v-model.number="user.id_role" @change="updateUserRole(user.id, user.id_role)" class="role-select">
                                    <option v-for="role in availableRoles.filter(r => r.id !== 1)" :key="role.id" :value="role.id">{{ role.name }}</option>
                                </select>
                            </td>
                            <td>
                                <span :class="['status-badge', user.is_banned ? 'status-inactive' : 'status-active']">
                                    {{ user.is_banned ? 'Забанен' : 'Активен' }}
                                </span>
                            </td>

                            <td class="actions-td">
                                <button 
                                    v-if="Number(user.id_role) !== 1 && !(userStore.userRole === 'Модератор' && Number(user.id_role) === 2)"
                                    @click="toggleUserBan(user)" 
                                    :class="user.is_banned ? 'btn-primary btn-small' : 'btn-delete btn-small'"
                                >
                                    {{ user.is_banned ? 'Разбанить' : 'Бан' }}
                                </button>
                                <span v-else class="text-muted">—</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-data">Пользователи не найдены.</div>
            </div>

            <div v-if="currentTab === 'reports'" class="tab-content">
                <h2>Типы жалоб</h2>

                <div class="genres-management-header">
                    <form @submit.prevent="saveReportType" class="genre-form">
                        <input v-model="reportTypeForm.name" type="text" placeholder="Название типа жалобы" required />
                        <button type="submit" class="btn-primary" :disabled="isLoading">
                            {{ isEditingReportType ? 'Сохранить' : 'Добавить тип' }}
                        </button>
                        <button v-if="isEditingReportType" type="button" @click="resetReportTypeForm" class="btn-secondary">
                            Отмена
                        </button>
                    </form>

                    <div class="search-wrapper">
                        <input v-model="reportTypesSearchQuery" type="text" placeholder="Поиск типа..." class="search-input"/>
                        <button v-if="reportTypesSearchQuery" @click="reportTypesSearchQuery = ''" class="btn-clear-search" type="button">&times;</button>
                    </div>
                </div>

                <div v-if="totalReportTypesPages > 1" class="pagination">
                    <button :disabled="reportTypesCurrentPage === 1" @click="reportTypesCurrentPage--" class="btn-page">&laquo;</button>
                    <button v-for="page in totalReportTypesPages" :key="page" :class="{ active: reportTypesCurrentPage === page }" @click="reportTypesCurrentPage = page" class="btn-page">{{ page }}</button>
                    <button :disabled="reportTypesCurrentPage === totalReportTypesPages" @click="reportTypesCurrentPage++" class="btn-page">&raquo;</button>
                </div>

                <table class="admin-table" v-if="filteredReportTypes.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название типа</th>
                            <th class="actions-th">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in paginatedReportTypes" :key="type.id">
                            <td>{{ type.id }}</td>
                            <td>{{ type.name }}</td>
                            <td class="actions-td">
                                <button @click="editReportType(type)" class="btn-edit">Редактировать</button>
                                <button @click="deleteReportType(type.id)" class="btn-delete" :disabled="isLoading">Удалить</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-data">Типы жалоб не найдены.</div>
            </div>

            <div v-if="currentTab === 'comment-reports'" class="tab-content">
                <h2>Жалобы на комментарии</h2>
                <div class="users-management-header">
                    <button 
                        @click="deleteReviewedReports" 
                        class="btn-secondary" 
                        :disabled="isLoading"
                        style="margin-bottom: 0;"
                    >
                        Очистить рассмотренные
                    </button>
                    <div class="header-spacer"></div>
                    <div class="search-wrapper">
                        <input v-model="commentReportsSearchQuery" type="text" placeholder="Поиск по тексту или автору..." class="search-input" />
                        <button v-if="commentReportsSearchQuery" @click="commentReportsSearchQuery = ''" class="btn-clear-search" type="button">&times;</button>
                    </div>
                </div>

                <div v-if="totalCommentReportsPages > 1" class="pagination">
                    <button :disabled="commentReportsCurrentPage === 1" @click="commentReportsCurrentPage--" class="btn-page">&laquo;</button>
                    <button v-for="page in totalCommentReportsPages" :key="page" :class="{ active: commentReportsCurrentPage === page }" @click="commentReportsCurrentPage = page" class="btn-page">{{ page }}</button>
                    <button :disabled="commentReportsCurrentPage === totalCommentReportsPages" @click="commentReportsCurrentPage++" class="btn-page">&raquo;</button>
                </div>

                <table class="admin-table" v-if="filteredCommentReports.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Отправитель</th>
                            <th>Тип жалобы</th>
                            <th>Текст жалобы</th>
                            <th>Текст комментария</th>
                            <th>Дата жалобы</th>
                            <th>Статус</th> 
                            <th class="actions-th">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="report in paginatedCommentReports" :key="report.id">
                            <td>{{ report.id }}</td>
                            <td><span class="user-username">{{ report.user?.email }}</span></td>
                            <td><span class="report-reason">{{ report.reportType?.name }}</span></td>

                            <td class="comment-text-cell" :title="report.text">
                                {{ report.text || 'Без описания' }}
                            </td>

                            <td class="comment-text-cell" :title="report.comment?.text">
                                <span v-if="report.comment">{{ report.comment.text }}</span>
                                <span v-else class="text-muted"><i>[Комментарий удален]</i></span>
                            </td>

                            <td>{{ formatDate(report.created_at) }}</td>

                            <td>
                                <span :class="['status-badge', 
                                    (report.reportStatus.name === 'В ожидании') ? 'status-pending' : 
                                    (report.reportStatus.name === 'Принята') ? 'status-active' : 'status-inactive']">
                                    {{ report.reportStatus.name }}
                                </span>
                            </td>
                            <td class="actions-td">
                                <template v-if="report.reportStatus.name === 'В ожидании'">
                                    <button @click="handleReportAction(report.id, 1)" class="btn-primary btn-small">Принять</button>
                                    <button @click="handleReportAction(report.id, 2)" class="btn-delete btn-small">Отклонить</button>
                                </template>
                                <template v-else>
                                    <span class="text-muted">Рассмотрено</span>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-data">Жалоб на комментарии не найдено.</div>
            </div>

            <div v-if="currentTab === 'artist-apps'" class="tab-content">
                <h2>Заявки на статус исполнителя</h2>
                <div class="users-management-header">
                    <div class="header-spacer"></div>
                    <div class="search-wrapper">
                        <input v-model="artistApplicationsSearchQuery" type="text" placeholder="Поиск по нику или псевдониму..." class="search-input" />
                        <button v-if="artistApplicationsSearchQuery" @click="artistApplicationsSearchQuery = ''" class="btn-clear-search" type="button">&times;</button>
                    </div>
                </div>

                <div v-if="totalArtistApplicationsPages > 1" class="pagination">
                    <button :disabled="artistApplicationsCurrentPage === 1" @click="artistApplicationsCurrentPage--" class="btn-page">&laquo;</button>
                    <button v-for="page in totalArtistApplicationsPages" :key="page" :class="{ active: artistApplicationsCurrentPage === page }" @click="artistApplicationsCurrentPage = page" class="btn-page">{{ page }}</button>
                    <button :disabled="artistApplicationsCurrentPage === totalArtistApplicationsPages" @click="artistApplicationsCurrentPage++" class="btn-page">&raquo;</button>
                </div>

                <table class="admin-table" v-if="filteredArtistApplications.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Пользователь</th>
                            <th>Псевдоним</th>
                            <th>Описание</th>
                            <th>Дата подачи</th>
                            <th>Статус</th>
                            <th class="actions-th">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="app in paginatedArtistApplications" :key="app.id">
                            <td>{{ app.id }}</td>
                            <td>{{ app.User?.username }}</td>
                            <td><strong>{{ app.stage_name }}</strong></td>
                            <td class="comment-text-cell">{{ app.description || 'Нет описания' }}</td>
                            <td>{{ formatDate(app.createdAt) }}</td>
                            <td>
                                <span :class="['status-badge', 
                                    app.status === 'pending' ? 'status-pending' : 
                                    app.status === 'accepted' ? 'status-active' : 'status-inactive']">
                                    {{ app.status === 'pending' ? 'Ожидает' : app.status === 'accepted' ? 'Одобрено' : 'Отклонено' }}
                                </span>
                            </td>
                            <td class="actions-td">
                                <template v-if="app.status === 'pending'">
                                    <button @click="handleApplicationAction(app.id, 'accepted')" class="btn-primary btn-small">Одобрить</button>
                                    <button @click="handleApplicationAction(app.id, 'rejected')" class="btn-delete btn-small">Отклонить</button>
                                </template>
                                <template v-else>
                                    <span class="text-muted">Обработано</span>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="no-data">Заявки не найдены.</div>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .loader, .no-data {
        text-align: center;
        padding: 40px;
        color: var(--text-secondary);
        font-size: 16px;
    }

    .admin-panel {
        flex-grow: 1;
        background-color: var(--bg-tertiary, #1e1e24);
        color: var(--text-primary);
        border-radius: 10px;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;

        .info-content {
            height: 1vh; 
        }

        .admin-nav {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;

            button {
                background: none;
                border: none;
                color: var(--text-secondary);
                padding: 10px 15px;
                cursor: pointer;
                font-size: 16px;
                border-radius: 5px;
                transition: all 0.3s;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                }

                &.active {
                    background-color: var(--accent-color, #3f51b5);
                    color: #fff;
                }
            }
        }

        .tab-content {
            h2 {
                margin-top: 0;
                margin-bottom: 20px;
            }
        }

        .genre-form {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;

            input {
                padding: 8px 12px;
                border-radius: 5px;
                border: 1px solid #444;
                background: var(--bg-primary);
                color: var(--text-primary);
                flex-grow: 1;
                max-width: 300px;
            }
        }

        .admin-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-bottom: 20px;

            th, td {
                padding: 12px;
                border-bottom: 1px solid #333;
            }

            th {
                color: var(--text-secondary);
            }
        }

        .admin-table td {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .admin-table td.actions-td {
            max-width: none;
            overflow: visible;
        }

        button, select {
            font-family: inherit;
        }

        .btn-primary { background: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } }
        .btn-secondary { background: #666; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
        .btn-edit { background: #ff9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;}
        .btn-delete { background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; &:disabled { opacity: 0.5; } }

        .btn-small {
            padding: 4px 8px;
            font-size: 13px;
            margin-right: 5px;
        }
        
        .comment-text-cell {
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .report-reason {
            color: #ef5350;
            font-weight: 500;
        }

        .text-muted {
            color: #666;
            font-size: 14px;
        }

        .actions-th { 
            width: 200px; 
            min-width: 200px;
        }

        .actions-td { 
            display: table-cell;
            vertical-align: middle; 
            white-space: nowrap;
            
            & > button, & > span, & > template {
                display: inline-flex;
                align-items: center;
                vertical-align: middle;
            }
        }

        .role-select {
            padding: 6px 10px;
            background: var(--bg-primary);
            color: var(--text-primary);
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-top: 20px;
        }

        .btn-page {
            background: #2a2a32;
            color: #fff;
            border: 1px solid #444;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;

            &:hover:not(:disabled) {
                background: var(--accent-color, #3f51b5);
            }

            &.active {
                background: var(--accent-color, #3f51b5);
                border-color: var(--accent-color, #3f51b5);
            }

            &:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
        }
    }

    .genres-management-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .genre-form {
        display: flex;
        gap: 10px;
        flex-grow: 1;

        input {
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid #444;
            background: var(--bg-primary, #121214);
            color: var(--text-primary);
            flex-grow: 1;
            max-width: 300px;
        }
    }

    .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 275px;

        .search-input {
            width: 100%;
            padding: 8px 35px 8px 12px;
            border-radius: 5px;
            border: 1px solid #444;
            background: var(--bg-primary, #121214);
            color: var(--text-primary);
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;

            &:focus {
                border-color: var(--accent-color, #3f51b5);
            }
        }

        .btn-clear-search {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:hover {
                color: var(--text-primary);
            }
        }
    }

    .user-username {
        font-weight: 500;
    }

    .password-shield {
        color: #666;
        letter-spacing: 2px;
        cursor: help;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }

    .status-active {
        background-color: rgba(76, 175, 80, 0.2);
        color: #4caf50;
    }

    .status-inactive {
        background-color: rgba(244, 67, 54, 0.2);
        color: #f44336;
    }

    .status-pending {
        background-color: rgba(255, 152, 0, 0.2);
        color: #ff9800;
    }

    .users-management-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .header-spacer {
        flex-grow: 1;
    }
</style>