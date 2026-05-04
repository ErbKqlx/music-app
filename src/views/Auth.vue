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
                    }

                    console.log(user)

                    localStorage.setItem('token', response.data.data.accessToken)
                    userStore.setUser(user)

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
        // if (userStore.currentUser != null){
        //     router.push('/profile/' + userStore.currentUser.id)
        // }
        
        if (localStorage.getItem('token') != null){
            router.push('/profile/' + userStore.currentUser.id)
        }
    })
</script>

<template>
    <div class="wrapper">
        <form class="authorization-form" @submit.prevent="sendData()" novalidate>
            <span>Авторизация</span>
            <div class="auth-fields">
                <div>
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="form.data.email">
                    <span class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">{{ error.$message }}</span>
                    <span class="error" v-if="error">{{ error }}</span>
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <input type="password" id="password" name="password" v-model="form.data.password">
                    <span class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
            </div>
            <div class="no-account">
                <span>Нет аккаунта? </span>
                <RouterLink to="/register">Зарегистрироваться</RouterLink>
            </div>
            <SubmitButton :disabled="form.isSending" :class="{'disabled': form.isSending}" value="Войти в аккаунт"/>
            <RouterLink class="password-recovery" to="/password-recovery">Забыли пароль?</RouterLink>
        </form>
    </div>
</template>

<style scoped>
    .wrapper{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        align-items: center;
        justify-content: center;

        .authorization-form{
            display: flex;
            flex-direction: column;
            min-width: 25vw;
            min-height: 33vh;
            gap: 10px;

            .auth-fields{
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 35px;
            }

            .auth-fields div{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            label{
                font-size: 16px;
            }

            .no-account, .password-recovery{
                align-self: center;
            }
            
            a, span{
                font-size: 14px;
            }

            > span{
                font-size: 32px;
            }

            label, span, a{
                color: white;
                font-family: Inter;
            }

            a{
                color: rgb(125, 132, 255);
                text-decoration: none;
            }

            a:hover{
                text-decoration: underline;
            }

            input{
                border-radius: 5px;
                height: 33px;
                font-size: 20px;
                background-color: rgb(217 , 217, 217);
                border: none;
                padding: 0 5px;
            }

            input[type='submit']{
                height: 40px;
                font-weight: bold;
                font-size: 14px;
            }

            input[type='submit']:hover{
                cursor: pointer;
                background-color: rgb(140, 140, 140);
            }

            .error{
                color: red;
            }
        }
    }
</style>