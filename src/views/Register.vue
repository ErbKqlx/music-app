<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'
    import Form from '@/components/Form.vue'
    import { onMounted, ref } from 'vue';
    import http from '../http';
    import useVuelidate from '@vuelidate/core';
    import { email, helpers, required, sameAs } from '@vuelidate/validators';
    import { useFormErrors } from '@/composables/useFormErrors';
    import { usePlayerStore } from '../stores/player';
    import { useThemeStore } from '../stores/theme';

    const playerStore = usePlayerStore()
    const themeStore = useThemeStore()

    const { errors, setErrors, clearErrors, getErrors, hasErrors } = useFormErrors()

    const form = ref({
        data: {
            username: '',
            email: '',
            password: '',
            consent: false,
        },
        isSending: false,
    })

    const rules = {
        data: {
            username: { required: helpers.withMessage('Поле не может быть пустым', required) },
            email: { 
                required: helpers.withMessage('Поле не может быть пустым', required), 
                email: helpers.withMessage('Email введен некорректно', email),
            },
            password: { required: helpers.withMessage('Поле не может быть пустым', required), },
            consent: { sameAs: helpers.withMessage('Вы должны дать согласие', sameAs(true)), }
        }
        
    }

    const $v = useVuelidate(rules, form)

    async function sendData(){
        if (form.value.isSending) return

        form.value.isSending = true

        setErrors({})

        $v.value.$touch()


        if (!$v.value.$invalid){
            try{
                const response = await http.post('/register', form.value.data)
                router.push(`/verify-email?email=${encodeURIComponent(form.value.data.email)}`)
                console.log(response.data)
            }
            catch (error) {
                console.log(error.response?.data)
                if (error.response?.data?.errors){
                    
                    setErrors(error.response?.data?.errors)
                }
            }
            
        }
        
        form.value.isSending = false
    }

    onMounted(() => {
        playerStore.stopSong()
        themeStore.setTheme(true)
    })
</script>

<template>
    <div class="wrapper">
        <form class="registration-form" @submit.prevent="sendData()" novalidate>
            <span>Регистрация</span>
            <div class="register-fields">
                <div>
                    <label for="username">Имя пользователя <span style="color:red;">*</span></label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        v-model="form.data.username"
                        autocomplete="off"
                        :class="{'error-input': hasErrors('email')}">
                    <span class="error" v-for="error of $v.data.username.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
                <div>
                    <label for="email">Email <span style="color:red;">*</span></label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        v-model="form.data.email" 
                        @input="clearErrors('email')" 
                        :class="{'error-input': hasErrors('email')}"
                        autocomplete="off">
                    <div class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                    <div class="error" v-for="(error, index) in getErrors('email')" :key="index">
                        {{ error }}
                    </div>
                </div>
                <div>
                    <label for="password">Пароль <span style="color:red;">*</span></label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        v-model="form.data.password" 
                        @input="clearErrors('password')" 
                        :class="{'error-input': hasErrors('password')}"
                        autocomplete="off">
                    <p class="requirements">Пароль должен содержать хотя бы одну букву<br>Пароль должен содержать не менее 6 символов</p> 
                    <div class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                    <div class="error" v-for="(error, index) in getErrors('password')" :key="index">
                        {{ error }}
                    </div>
                </div>
                <div>
                    <div class="consent-wrapper">
                        <input type="checkbox" name="consent" id="consent" v-model="form.data.consent">
                        <label for="consent">Согласие на обработку персональных данных <span style="color:red;">*</span></label>
                    </div>
                    <div class="error" v-for="error of $v.data.consent.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>
            </div>
            <div class="have-account">
                <span>Есть аккаунт? </span>
                <RouterLink to="/login">Войти</RouterLink>
            </div>
            <SubmitButton :disabled="form.isSending" :class="{'disabled': form.isSending}" value="Создать аккаунт"/>
        </form>

        <RouterLink to="/" class="home">На главную</RouterLink>
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

    .registration-form {
        display: flex;
        flex-direction: column;
        width: 30vw;
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

        .register-fields {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 35px;
        }

        .register-fields div {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .consent-wrapper {
            display: flex;
            flex-direction: row !important;
            align-items: center;
            gap: 12px !important;
            margin-top: 5px;
        }

        label {
            font-size: 14px;
            font-weight: 500;
        }

        .have-account {
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

        input[type='checkbox'] {
            width: 18px;
            height: 18px;
            accent-color: rgb(125, 132, 255);
            cursor: pointer;
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

        .requirements {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.4;
            margin: 2px 0;
        }

        .error {
            color: #ff5c5c;
            font-size: 12px;
            margin-top: 2px;
        }

        .error-input {
            border: 1px solid #ff5c5c !important;
            background-color: rgba(255, 92, 92, 0.05);
        }
    }

    .home{
        margin-top: 10px;
    }
</style>