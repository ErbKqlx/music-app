<script setup>
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import http from '../http';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import { useUserStore } from '@/stores/user';
    import { useFormErrors } from '@/composables/useFormErrors';
    import { usePlaylistStore } from '../stores/playlist';
    import { useToastStore } from '../stores/toast';

    const route = useRoute();
    const router = useRouter();
    const code = ref('');
    const error = ref('');
    const isSending = ref(false);
    const email = ref(route.query.email || '');

    const isResending = ref(false);

    const userStore = useUserStore()
    const playlistStore = usePlaylistStore()
    const toastStore = useToastStore()

    const { errors, setErrors, clearErrors, getErrors, hasErrors } = useFormErrors()
    
    async function verifyCode() {
        if (isSending.value) return;
        
        if (!code.value || code.value.length !== 6) {
            error.value = 'Введите 6-значный код';
            return;
        }
        
        isSending.value = true;
        error.value = '';
        
        try {
            const response = await http.post('/verify-code', {
                email: email.value,
                code: code.value
            });
            
            localStorage.setItem('token', response.data.accessToken);
            userStore.setUser(response.data.user)

            playlistStore.fetchPlaylists(response.data.user.id)

            router.push(`/profile/${response.data.user.id}`);
        } 
        catch (err) {
            error.value = err.response?.data?.message || 'Ошибка подтверждения';
        }

        isSending.value = false;
    }

    async function resendCode() {
        if (isResending.value || isSending.value) return;
        
        isResending.value = true;
        error.value = '';
        
        try {
            await http.post('/resend-code', { email: email.value });
            
            toastStore.show('Новый код отправлен на вашу почту', 'success');
        } 
        catch (err) {
            error.value = err.response?.data?.message || 'Не удалось отправить код повторно';
        } 
        finally {
            isResending.value = false;
        }
    }
</script>

<template>
    <div class="wrapper">
        <form class="verify-form" @submit.prevent="verifyCode">
            <span>Подтверждение почты</span>
            <p class="info">Код отправлен на {{ email }}</p>
            
            <div class="field">
                <label for="code">Введите 6-значный код подтверждения</label>
                <input 
                    type="text" 
                    name="code"
                    id="code" 
                    v-model="code" 
                    placeholder="123456"
                    maxlength="6"
                    autocomplete="off"
                    :class="{'error-input': hasErrors('code')}"
                />
                <span class="error" v-if="error">{{ error }}</span>
            </div>
            
            <SubmitButton :disabled="isSending"/>
            
            <div class="resend">
                <span>Не пришел код? </span>
                <a href="#" @click.prevent="resendCode" :class="{ 'disabled-link': isResending }">
                    {{ isResending ? 'Отправка...' : 'Отправить снова' }}
                </a>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        align-items: center;
        justify-content: center;
        
        background-color: #0d0e12; 
        position: relative;
        overflow: hidden;
    }

    .wrapper::before,
    .wrapper::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        filter: blur(50px); 
        opacity: 0.18;
        z-index: 1;
        display: block;
        transform: translate(0, 0) scale(1) rotate(0deg);
        animation: float-bg 12s infinite alternate ease-in-out;
    }

    .wrapper::before {
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, #7d84ff 0%, transparent 75%);
        top: -5%;
        left: -5%;
    }

    .wrapper::after {
        width: 550px;
        height: 550px;
        background: radial-gradient(circle, #ec4899 0%, transparent 75%);
        bottom: -10%;
        right: -10%;
        animation-duration: 16s;
        animation-delay: -4s;
    }

    @keyframes float-bg {
        0% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
        }
        50% {
            transform: translate(120px, 80px) scale(1.2) rotate(180deg);
        }
        100% { 
            transform: translate(-60px, 150px) scale(0.9) rotate(360deg); 
        }
    }

    .verify-form {
        display: flex;
        flex-direction: column;
        min-width: 25vw;
        gap: 20px;
        
        position: relative;
        z-index: 2; 

        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

        label, span, a, p {
            font-family: Inter, sans-serif;
        }

        > span {
            font-size: 28px;
            font-weight: 700;
            color: white;
            text-align: center;
        }

        .info {
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            font-size: 14px;
            margin: -5px 0 5px 0;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label {
            font-size: 14px;
            font-weight: 500;
            color: white;
            text-align: center;
        }

        input {
            border-radius: 6px;
            height: 42px;
            font-size: 22px;
            font-weight: 600;
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0 12px;
            color: white;
            text-align: center;
            transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
            outline: none;
            background-color: rgba(255, 255, 255, 0.15);
            border-color: rgb(125, 132, 255);
            box-shadow: 0 0 10px rgba(125, 132, 255, 0.2);
        }

        input[type='text'] {
            letter-spacing: 6px;
            text-indent: 6px;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.2);
        }

        input[type='submit'] {
            height: 44px;
            font-weight: 600;
            font-size: 14px;
            background-color: #ffffff;
            color: #000000;
            border: none;
            margin-top: 10px;
            padding: 0;
            transition: opacity 0.2s, transform 0.1s;
        }

        input[type='submit']:hover {
            cursor: pointer;
            opacity: 0.9;
        }

        input[type='submit']:active {
            transform: scale(0.98);
        }

        .error {
            color: #ff5c5c;
            font-size: 12px;
            margin-top: 4px;
            text-align: center;
        }

        .error-input {
            border: 1px solid #ff5c5c !important;
            background-color: rgba(255, 92, 92, 0.05);
        }

        .resend {
            text-align: center;
            font-size: 14px;
            color: white;
            margin-top: 5px;
        }

        .resend a {
            color: rgb(125, 132, 255);
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s;
        }

        .resend a:hover {
            color: rgb(160, 166, 255);
            text-decoration: underline;
        }

        .resend a.disabled-link {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
        }
    }
</style>