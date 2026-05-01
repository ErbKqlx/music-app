<script setup>
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import http from '../http';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import { useUserStore } from '@/stores/user';
    import { useFormErrors } from '@/composables/useFormErrors';

    const route = useRoute();
    const router = useRouter();
    const code = ref('');
    const error = ref('');
    const isSending = ref(false);
    const email = ref(route.query.email || '');

    const userStore = useUserStore()
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

            router.push(`/profile/${response.data.user.id}`);
        } 
        catch (err) {
            error.value = err.response?.data?.message || 'Ошибка подтверждения';
        }

        isSending.value = false;
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
                <a href="#" @click.prevent="$emit('resend')">Отправить снова</a>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .wrapper {
        display: flex;
        min-height: 100vh;
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    .verify-form {
        display: flex;
        flex-direction: column;
        min-width: 25vw;
        gap: 20px;
    }

    .verify-form > span {
        font-size: 32px;
        color: white;
        text-align: center;
    }

    .info {
        color: rgb(135, 135, 135);
        text-align: center;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    label {
        font-size: 16px;
        color: white;
    }

    input {
        border-radius: 5px;
        height: 33px;
        font-size: 20px;
        background-color: rgb(217, 217, 217);
        border: none;
        padding: 0 5px;
        text-align: center;
        /* letter-spacing: 5px; */
    }

    input[type='text']{
        letter-spacing: 5px;
    }

    .error {
        color: red;
        font-size: 14px;
    }

    .error-input {
        border: 1px solid red !important;
    }

    .resend {
        text-align: center;
        font-size: 14px;
        color: white;
    }

    .resend a {
        color: rgb(125, 132, 255);
        text-decoration: none;
        cursor: pointer;
    }

    .resend a:hover {
        text-decoration: underline;
    }
</style>