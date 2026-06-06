<script setup>
    import { useRoute } from 'vue-router';
    import http from '../http';
    import { useUserStore } from '../stores/user';
    import { usePlayerStore } from '../stores/player';
    import router from '../router';
    import { useSearchStore } from '../stores/search';
    import { ref, computed, onUnmounted } from 'vue';
    import Button from '@/components/Input/Button.vue'
    import { useModalStore } from '../stores/modal';
    import { useThemeStore } from '../stores/theme';

    const searchStore = useSearchStore();
    const query = ref('');
    const isProfileMenuOpen = ref(false);

    const userStore = useUserStore()
    const playerStore = usePlayerStore()
    const modalStore = useModalStore()
    const themeStore = useThemeStore()

    const userInitials = computed(() => {
        if (userStore.currentUser?.username) {
            return userStore.currentUser.username.slice(0, 2).toUpperCase();
        }
        return 'U';
    });

    const avatarColor = computed(() => {
        if (!userStore.currentUser?.username) return '#5577ee';
        const colors = ['#5577ee', '#ee55aa', '#55eeaa', '#eeaa55', '#aa55ee'];
        const index = userStore.currentUser.username.length % colors.length;
        return colors[index];
    });

    const themeText = computed(() => {
        return themeStore.isDarkMode ? 'Тёмная тема' : 'Светлая тема';
    });

    function toProfile() {
        isProfileMenuOpen.value = false;
        if (userStore.currentUser) {
            const userId = userStore.currentUser.id;
            router.push('/profile/' + userId);
        } else {
            router.push('/');
        }
    }

    function openModal() {
        isProfileMenuOpen.value = false;
        modalStore.openModal('song')
    }

    function logout() {
        isProfileMenuOpen.value = false;
        userStore.logout();
        playerStore.stopSong();
        router.push(`/`);
    }

    function toggleTheme() {
        themeStore.toggleTheme();
    }

    function handleClickOutside(event) {
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer && !profileContainer.contains(event.target)) {
            isProfileMenuOpen.value = false;
        }
    }

    const toggleProfileMenu = () => {
        isProfileMenuOpen.value = !isProfileMenuOpen.value;
        if (isProfileMenuOpen.value) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
    };

    let timeout = null;

    const handleInput = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (query.value.trim().length >= 2) {
                router.push({ 
                    path: '/search', 
                    query: { q: query.value } 
                });
            }
        }, 500);
    };

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<template>
    <div class="page-header">
        <RouterLink to="/" class="clickable">Главная</RouterLink>
        
        <div v-if="userStore.currentUser" class="search">
            <form role="search">
                <input 
                    id="search" 
                    type="search" 
                    placeholder="Поиск музыки..." 
                    v-model="query" 
                    @input="handleInput"
                >
            </form>
        </div>
        
        <div class="header-actions">
            <!-- <Button @click="modalStore.openModal('song')">Загрузить трек</Button> -->
            
            <div v-if="userStore.currentUser" class="profile-container" @click.stop>
                <div class="profile-trigger" @click="toggleProfileMenu">
                    <div class="avatar" :style="{ backgroundColor: avatarColor }">
                        {{ userInitials }}
                    </div>
                    <div class="user-info">
                        <span class="username">{{ userStore.currentUser.username }}</span>
                        <svg class="chevron" :class="{ rotated: isProfileMenuOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                
                <transition name="fade">
                    <div v-if="isProfileMenuOpen" class="profile-dropdown">
                        <div class="dropdown-header">
                            <div class="avatar-large" :style="{ backgroundColor: avatarColor }">
                                {{ userInitials }}
                            </div>
                            <div class="dropdown-user-info">
                                <div class="dropdown-username">{{ userStore.currentUser.username }}</div>
                                <div class="dropdown-email">{{ userStore.currentUser.email }}</div>
                            </div>
                        </div>
                        
                        <div class="dropdown-divider"></div>
                        
                        <div class="dropdown-item" @click="toProfile">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            <span>Мой профиль</span>
                        </div>
                        
                        <div class="dropdown-item" @click="openModal" v-if="userStore.isArtist">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Загрузить трек</span>
                        </div>

                        <!-- <div class="dropdown-item">
                            <span>Настройки</span>
                        </div> -->

                        <div class="dropdown-item theme-toggle" @click="toggleTheme">
                            <!-- <span class="theme-icon">{{ themeIcon }}</span> -->
                            <span>{{ themeText }}</span>
                            <div class="theme-switch">
                                <div class="switch-track" :class="{ active: !themeStore.isDarkMode }">
                                    <div class="switch-thumb"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dropdown-divider"></div>
                        
                        <div class="dropdown-item logout" @click="logout">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Выйти</span>
                        </div>
                    </div>
                </transition>
            </div>
            
            <div v-else class="auth-buttons">
                <RouterLink to="/login" class="auth-link">Войти</RouterLink>
                <RouterLink to="/register" class="auth-link register">Регистрация</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .page-header {
        /* background-color: rgba(0, 0, 0, 0.95); */
        background-color: var(--bg-primary);
        backdrop-filter: blur(10px);
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        position: sticky;
        top: 0;
        z-index: 1000;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-actions {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .search {
        width: 30vw;
        height: 100%;
    }

    .search form {
        height: 100%;
        display: flex;
        width: 100%;
    }

    .search input {
        border: none;
        /* color: #fff; */
        color: var(--text-primary);
        /* background-color: rgba(255, 255, 255, 0.1); */
        background-color: var(--bg-tertiary);
        width: 100%;
        height: 40px;
        border-radius: 20px;
        font-size: 14px;
        padding: 0 16px;
        align-self: center;
        flex-grow: 1;
        border: 1px solid transparent;
        transition: all 0.3s ease;
    }

    .search input::placeholder {
        /* color: rgba(255, 255, 255, 0.6); */
        color: var(--text-primary);
    }

    .search input:hover {
        /* background-color: rgba(255, 255, 255, 0.15); */
        background-color: var(--bg-hover);
    }

    .search input:focus {
        outline: none;
        /* background-color: rgba(255, 255, 255, 0.15); */
        /* background-color: var(--bg-primary); */
        border-color: var(--accent-color);
    }

    a {
        /* color: white; */
        color: var(--text-primary);
        align-self: center;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    a:hover {
        color: var(--accent-color);
    }

    /* button {
        background-color: #5577ee;
        color: white;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 20px;
        transition: all 0.3s ease;
    } */

    /* button:hover {
        background-color: #4455cc;
        transform: translateY(-1px);
    } */

    .profile-container {
        position: relative;
    }

    .profile-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 30px;
        /* background-color: rgba(255, 255, 255, 0.05); */
        background-color: var(--bg-tertiary);
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }

    .profile-trigger:hover {
        /* background-color: rgba(255, 255, 255, 0.1); */
        background-color: var(--bg-hover);
        /* border-color: rgba(255, 255, 255, 0.2); */
        border-color: var(--border-hover);
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        /* color: white; */
        color: var(--text-primary);
        transition: transform 0.3s ease;
    }

    .profile-trigger:hover .avatar {
        transform: scale(1.05);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .username {
        font-size: 14px;
        font-weight: 500;
        /* color: white; */
        color: var(--text-primary);
    }

    .chevron {
        transition: transform 0.3s ease;
        /* color: rgba(255, 255, 255, 0.7); */
        color: var(--text-primary);
    }

    .chevron.rotated {
        transform: rotate(180deg);
    }

    .profile-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 280px;
        /* background: rgba(20, 20, 20, 0.98); */
        background-color: var(--bg-primary);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); */
        border: 1px solid var(--border-color);
        overflow: hidden;
        animation: slideDown 0.3s ease;
    }

    .dropdown-header {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .avatar-large {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        /* color: white; */
        color: var(--text-primary);
    }

    .dropdown-user-info {
        flex: 1;
    }

    .dropdown-username {
        font-weight: 600;
        /* color: white; */
        color: var(--text-primary);
        margin-bottom: 4px;
    }

    .dropdown-email {
        font-size: 12px;
        /* color: rgba(255, 255, 255, 0.6); */
        color: var(--text-secondary);
    }

    .dropdown-divider {
        height: 1px;
        /* background: rgba(255, 255, 255, 0.1); */
        background: var(--border-hover);
        margin: 8px 0;
    }

    .dropdown-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        /* color: white; */
        color: var(--text-primary);
    }

    .dropdown-item svg {
        flex-shrink: 0;
    }

    .dropdown-item span {
        flex: 1;
        font-size: 14px;
    }

    .dropdown-item:hover {
        /* background-color: rgba(255, 255, 255, 0.1); */
        background-color: var(--bg-hover);
    }

    .dropdown-item.logout:hover {
        background-color: rgba(220, 53, 69, 0.2);
        /* background-color: var(--danger-color); */
        color: #ff6b6b;
        /* color: var(--danger-color); */
    }

    .theme-toggle {
        justify-content: space-between;
    }

    .theme-icon {
        font-size: 18px;
    }

    .theme-switch {
        margin-left: auto;
    }

    .switch-track {
        width: 40px;
        height: 20px;
        background-color: var(--bg-tertiary);
        border-radius: 20px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s ease;
        border: 1px solid var(--border-color);
    }

    .switch-track.active {
        background-color: var(--accent-color);
    }

    .switch-thumb {
        width: 16px;
        height: 16px;
        background-color: white;
        border-radius: 50%;
        position: absolute;
        top: 1px;
        left: 2px;
        transition: transform 0.3s ease;
    }

    .switch-track.active .switch-thumb {
        transform: translateX(20px);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 0.3s ease;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .auth-buttons {
        display: flex;
        gap: 12px;
    }

    .auth-link {
        padding: 8px 20px;
        border-radius: 20px;
        transition: all 0.3s ease;
    }

    .auth-link.register {
        background-color: var(--accent-color);
    }

    .auth-link.register:hover {
        background-color: var(--accent-hover);
        color: white;
    }

    @media (max-width: 768px) {
        .page-header {
            padding: 0 15px;
        }
        
        .user-info {
            display: none;
        }
        
        .profile-dropdown {
            min-width: 260px;
        }
        
        .search {
            width: 40vw;
        }
    }
</style>