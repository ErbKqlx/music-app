<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'
    import Form from '@/components/Form.vue'
    import { ref } from 'vue';
    import http from '../http';
    import useVuelidate from '@vuelidate/core';
    import { email, helpers, required } from '@vuelidate/validators';

    // function toProfile(){
    //     router.push('/profile')
    // }

    const form = ref({
        data: {
            username: '',
            email: '',
            password: '',
        },
        errors: {},
        isSending: false,
    })

    const rules = {
        data: {
            username: { required: helpers.withMessage('Поле не может быть пустым', required) },
            email: { 
                required: helpers.withMessage('Поле не может быть пустым', required), 
                email: helpers.withMessage('Email введен некорректно', email),
            },
            password: { required: helpers.withMessage('Поле не может быть пустым', required), }
        }
        
    }

    const $v = useVuelidate(rules, form)
    // console.log($v)

    async function sendData(){
        if (form.value.isSending) return

        form.value.isSending = true

        form.value.errors = {}

        // console.log(form.value.data)

        // const emailCheck = helpers.withAsync(async value => {
        //     const response = await http.get(`/check-email?email=${value}`)
        // })

        $v.value.$touch()
        // console.log($v.value.$invalid)
        if (!$v.value.$invalid){
            
            await http.post('/register', form.value.data)
                .then(function (response){
                    router.push('/')
                    console.log(response.data)
                })
                .catch(function (response){
                    //form.value.errors = response.errors
                    console.log(response.response.data.message)
                })
        }
        
        form.value.isSending = false
            
    }
</script>

<template>
    <div class="wrapper">
        <form class="registration-form" @submit.prevent="sendData()" novalidate>
            <span>Регистрация</span>
            <!-- <Form>
                <div>
                    <label for="login">Логин</label>
                    <Input type="text" id="login" name="login"/>
                </div>
                <div>
                    <label for="email">Email</label>
                    <Input type="email" id="email" name="email"/>
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <Input type="password" id="password" name="password"/>
                    <span class="requirements">Требования к паролю</span>
                </div>
            </Form> -->
            <div class="register-fields">
                <!-- <div>
                    <label for="login">Логин</label>
                    <Input type="text" id="login" name="login"/>
                </div> -->
                <div>
                    <label for="username">Имя пользователя</label>
                    <!-- <Input type="email" id="email" name="email"/> -->
                    <input type="text" id="username" name="username" v-model="form.data.username">
                    <span class="error" v-for="error of $v.data.username.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
                <div>
                    <label for="email">Email</label>
                    <!-- <Input type="email" id="email" name="email"/> -->
                    <input type="email" id="email" name="email" v-model="form.data.email">
                    <span class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <!-- <Input type="password" id="password" name="password"/> -->
                    <input type="password" id="password" name="password" v-model="form.data.password">
                    <span class="requirements">Требования к паролю...</span>
                    <span class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
            </div>
            <div class="have-account">
                <span>Есть аккаунт? </span>
                <RouterLink to="/">Войти</RouterLink>
                <!-- <a href="auth.html">Войти</a> -->
            </div>
            <!-- <input type="submit" value="Создать аккаунт"> -->
            <SubmitButton :disabled="form.isSending" :class="{'disabled': form.isSending}" value="Создать аккаунт"/>
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

        .registration-form{
            display: flex;
            flex-direction: column;
            min-width: 25vw;
            min-height: 33vh;
            gap: 10px;

            .register-fields{
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 35px;
            }

            .register-fields div{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            label{
                font-size: 16px;
            }

            .have-account{
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

            .requirements{
                font-size: 12px;
                color: rgb(135, 135, 135);
            }

            .error{
                color: red;
            }
        }
    }
</style>