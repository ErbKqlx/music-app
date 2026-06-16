<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'
    import Form from '@/components/Form.vue'
    import http from '../http';
    import { onMounted, ref } from 'vue';
    import useVuelidate from '@vuelidate/core';
    import { helpers, required } from '@vuelidate/validators';
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/user';
    import { usePlaylistStore } from '@/stores/playlist';
    import { useFormErrors } from '@/composables/useFormErrors';
    import { usePlayerStore } from '../stores/player';
    import { useThemeStore } from '../stores/theme'

    const { errors, setErrors, clearErrors, getErrors, hasErrors } = useFormErrors()

    const error = ref('');

    const form = ref({
        data: {
            email: '',
            password: '',
        },
        errors: {},
        isSending: false,
    })

    const rules = {
        data: {
            email: { 
                required: helpers.withMessage('Поле не может быть пустым', required), 
                // email: helpers.withMessage('Email введен некорректно', email),
            },
            password: { required: helpers.withMessage('Поле не может быть пустым', required), }
        }
        
    }

    const $v = useVuelidate(rules, form)
    
    const userStore = useUserStore()
    const playlistStore = usePlaylistStore()
    const playerStore = usePlayerStore()
    const themeStore = useThemeStore()

    async function sendData(){
        if (form.value.isSending) return

        form.value.isSending = true

        // setErrors({})
        error.value = '';

        $v.value.$touch()

        if (!$v.value.$invalid){
            try{
                const response = await http.post('/login', form.value.data)
                console.log(response.data.data)
                if (response.data.data.isActivated == false){
                    router.push(`/verify-email?email=${encodeURIComponent(form.value.data.email)}`)
                }
                else{
                    const user = {
                        id: response.data.data.id,
                        username: response.data.data.username,
                        email: response.data.data.email,
                        avatar: response.data.data.avatar,
                        registration_date: response.data.data.registration_date,
                        id_role: response.data.data.id_role,
                        role_name: response.data.data.role_name,
                    }

                    console.log(user)

                    localStorage.setItem('token', response.data.data.accessToken)
                    userStore.setUser(user)

                    playlistStore.fetchPlaylists(user.id)

                    router.push('/profile/' + user.id)
                }
                
            }
            catch(err){
                // console.log(error)
                error.value = err.response?.data?.message || 'Неверный логин или пароль';
            }
        }

        form.value.isSending = false
            
    }

    onMounted(() => {
        playerStore.stopSong()
        themeStore.setTheme(true)

        if (userStore.currentUser && userStore.currentUser.id) {
            router.push('/profile/' + userStore.currentUser.id)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    })
</script>

<template>
    <div class="wrapper">
        <form class="authorization-form" @submit.prevent="sendData()" novalidate>
            <span>Авторизация</span>
            <div class="auth-fields">
                <div>
                    <label for="email">Email <span style="color:red;">*</span></label>
                    <input type="text" id="email" name="email" v-model="form.data.email">
                    <span class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">{{ error.$message }}</span>
                    <span class="error" v-if="error">{{ error }}</span>
                </div>
                <div>
                    <label for="password">Пароль <span style="color:red;">*</span></label>
                    <input type="password" id="password" name="password" v-model="form.data.password">
                    <span class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
            </div>
            <div class="no-account">
                <span>Нет аккаунта? </span>
                <RouterLink to="/register">Зарегистрироваться</RouterLink>
            </div>
            <SubmitButton :disabled="form.isSending" :class="{'disabled': form.isSending}" value="Войти в аккаунт"/>
            <!-- <RouterLink class="password-recovery" to="/password-recovery">Забыли пароль?</RouterLink> -->
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

    .authorization-form {
        display: flex;
        flex-direction: column;
        min-width: 25vw;
        min-height: 33vh;
        gap: 10px;
        
        position: relative;
        z-index: 2; 

        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

        .auth-fields {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 35px;
        }

        .auth-fields div {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        label {
            font-size: 14px;
            font-weight: 500;
        }

        .no-account, .password-recovery {
            align-self: center;
            margin-top: 5px;
        }
        
        a, span {
            font-size: 14px;
        }

        > span {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
            text-align: center;
        }

        label, span, a {
            color: white;
            font-family: Inter, sans-serif;
        }

        a {
            color: rgb(125, 132, 255);
            text-decoration: none;
            transition: color 0.2s;
        }

        a:hover {
            color: rgb(160, 166, 255);
            text-decoration: underline;
        }

        input {
            border-radius: 6px;
            height: 38px;
            font-size: 16px;
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0 12px;
            color: white;
            transition: background-color 0.2s, border-color 0.2s;
        }

        input:focus {
            outline: none;
            background-color: rgba(255, 255, 255, 0.15);
            border-color: rgb(125, 132, 255);
        }

        input[type='submit'] {
            height: 44px;
            font-weight: 600;
            font-size: 14px;
            background-color: #ffffff;
            color: #000000;
            border: none;
            margin-top: 10px;
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
            margin-top: 2px;
        }
    }
</style>