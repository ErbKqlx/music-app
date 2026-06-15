<script setup>
    import { onMounted, reactive, ref } from 'vue'
    import { useModalStore } from '@/stores/modal'
    import Modal from '@/components/Modal.vue'
    import Button from '@/components/Input/Button.vue'
    import http from '@/http.js'
    import { useToastStore } from '../../stores/toast'

    const modalStore = useModalStore()
    const toastStore = useToastStore()

    const formData = reactive({
        name: '',
        bio: ''
    })

    const captchaToken = ref('')

    const SITE_KEY = '6Lcc1yAtAAAAAEu5_zZTf0s5U_4lB_lu5AD2aLP9'

    onMounted(() => {
        if (!window.grecaptcha) {
            const script = document.createElement('script')
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
            script.async = true
            script.defer = true
            document.head.appendChild(script)
            
            window.onRecaptchaLoad = () => {
                renderBadge()
            }
        } else {
            renderBadge()
        }
    })

    function renderBadge() {
        setTimeout(() => {
            if (window.grecaptcha && document.getElementById('recaptcha-container')) {
                window.grecaptcha.render('recaptcha-container', {
                    sitekey: SITE_KEY,
                    theme: 'dark',
                    callback: (token) => {
                        captchaToken.value = token
                    },
                    'expired-callback': () => {
                        captchaToken.value = ''
                    }
                })
            }
        }, 100)
    }

    async function handleSubmit() {
        if (!formData.name.trim()) {
            toastStore.show('Пожалуйста, укажите псевдоним', 'error')
            return
        }

        try {
            const payload = {
                name: formData.name.trim(),
                bio: formData.bio.trim() || null,
                captchaToken: captchaToken.value
            }

            await http.post('/artist-requests', payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem('token') },
            });

            toastStore.show('Заявка успешно отправлена', 'success')
            modalStore.closeModal()
        }
        catch (error) {
            console.error('Ошибка при отправлении заявки:', error)
            if (error.response?.status === 409) {
                toastStore.show(error.response.data.message, 'error')
            } else {
                toastStore.show('Ошибка при отправлении заявки', 'error')
            }
        }
    }
</script>

<template>
    <Modal @close="modalStore.closeModal" size="playlist">
        <template #header>
            <h2 class="modal-title">Стать исполнителем</h2>
        </template>

        <template #body>
            <form id="artist-request-form" @submit.prevent="handleSubmit" class="create-application-form">
                <div class="inputs-section">
                    <div class="field">
                        <label for="artist-name">Ваш псевдоним</label>
                        <input id="artist-name" type="text" v-model="formData.name" placeholder="Сценическое имя..." required>
                    </div>

                    <div class="field">
                        <label for="artist-bio">О себе / Биография</label>
                        <textarea id="artist-bio" v-model="formData.bio" placeholder="Расскажите о творчестве..." rows="3"></textarea>
                    </div>

                    <div class="captcha-field">
                        <div id="recaptcha-container"></div>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="actions">
                <Button class="secondary-btn" @click="modalStore.closeModal">Отмена</Button>
                <Button type="submit" form="artist-request-form">Отправить</Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
    }

    .create-application-form {
        display: flex;
        gap: 20px;
        padding: 10px 0;
    }
    
    .inputs-section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
            font-size: 14px;
            font-weight: bold;
            color: var(--text-primary);
        }

        input[type='text'], textarea {
            border-radius: 5px;
            font-size: 16px;
            background-color: rgb(217 , 217, 217);
            color: #111;
            border: none;
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
        }

        input[type='text'] {
            height: 38px;
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        width: 100%;
    }

    .secondary-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--text-primary);
    }
    
    .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .captcha-field {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
</style>