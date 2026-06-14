<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import http from '../http'
    import { useToastStore } from '../stores/toast'
    import { formatDate } from '@/composables/formatDate';
    import { useUserStore } from '../stores/user';

    const toastStore = useToastStore()
    const userStore = useUserStore()

    const currentTab = ref('genres')
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

    watch(currentTab, () => {
        genresCurrentPage.value = 1
        usersCurrentPage.value = 1
        reportTypesCurrentPage.value = 1
        genresSearchQuery.value = ''
        usersSearchQuery.value = ''
        reportTypesSearchQuery.value = ''
    })

    watch(genresSearchQuery, () => genresCurrentPage.value = 1)
    watch(usersSearchQuery, () => usersCurrentPage.value = 1)
    watch(reportTypesSearchQuery, () => reportTypesCurrentPage.value = 1)

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
            const res = await http.delete(`/genres/${id}`, getAuthConfig())
            genres.value = genres.value.filter(g => g.id !== id)
            if (genresCurrentPage.value > totalGenresPages.value && genresCurrentPage.value > 1) genresCurrentPage.value--
            toastStore.show(`Жанр удален`, 'success')
        } catch (error) {
            toastStore.show('Ошибка при удалении жанра', 'error')
        } standalone: { isLoading.value = false }
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

    onMounted(() => {
        fetchGenres()
        fetchUsers()
        fetchRoles()
        fetchReportTypes()
    })
</script>

<template>
    <div class="admin-panel">
        <div class="admin-nav">
            <button v-if="userStore.isAdmin" :class="{ active: currentTab === 'genres' }" @click="currentTab = 'genres'">
                Управление жанрами
            </button>
            <button :class="{ active: currentTab === 'users' }" @click="currentTab = 'users'">
                Пользователи{{ userStore.isAdmin ? ' и роли' : '' }}
            </button>
            <button v-if="userStore.isAdmin" :class="{ active: currentTab === 'reports' }" @click="currentTab = 'reports'">
                Типы жалоб
            </button>

            <!-- <button :class="{ active: currentTab === 'reports' }" @click="currentTab = 'reports'">
                Жалобы
            </button> -->

            <button v-if="userStore.isAdmin" :class="{ active: currentTab === 'applications' }" @click="currentTab = 'applications'">
                Заявки
            </button>
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
                            <th>Роль</th>
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
                            <td>
                                <select v-model.number="user.id_role" @change="updateUserRole(user.id, user.id_role)" class="role-select">
                                    <option v-for="role in availableRoles.filter(r => r.id !== 1)" :key="role.id" :value="role.id">{{ role.name }}</option>
                                </select>
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

        button, select {
            font-family: inherit;
        }

        .btn-primary { background: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } }
        .btn-secondary { background: #666; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
        .btn-edit { background: #ff9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;}
        .btn-delete { background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; &:disabled { opacity: 0.5; } }

        .actions-th { width: 200px; }
        .actions-td { display: flex; }

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
        /* color: var(--accent-color, #5c6bc0); */
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