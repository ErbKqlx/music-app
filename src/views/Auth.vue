<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'
    import Form from '@/components/Form.vue'
    import http from '../http';
    import { ref } from 'vue';
    import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

    // const formData = {
    //     login: {

    //     },
    //     email: {

    //     },
    //     password: {
            
    //     }
    // }

    // function toProfile(){
    //     router.push('/profile')
    // }

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

    

    async function sendData(){
        if (form.value.isSending) return

        form.value.isSending = true

        form.value.errors = {}

        // console.log(form.value.data)
        $v.value.$touch()

        if (!$v.value.$invalid){
            await http.post('/login', form.value.data)
                .then(function (axiosResponse){
                    router.push('/profile')
                    console.log(axiosResponse)
                })
                .catch(function (errors){
                    form.value.errors = errors
                    console.log(errors)
                })
        }

        form.value.isSending = false
            
    }

    
</script>

<template>
    <div class="wrapper">
        <form class="authorization-form" @submit.prevent="sendData()" novalidate>
            <span>Авторизация</span>
            <!-- <div class="errors" v-if="form.errors">
                <span style="color: red">Неверный email или пароль</span>
            </div> -->
            <div class="auth-fields">
                <div>
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="form.data.email">
                    <span class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">{{ error.$message }}</span>
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