<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'
    import Form from '@/components/Form.vue'
    import { ref } from 'vue';
    import http from '../http';
    import useVuelidate from '@vuelidate/core';
    import { email, helpers, required, sameAs } from '@vuelidate/validators';
    import { useFormErrors } from '@/composables/useFormErrors';

    // function toProfile(){
    //     router.push('/profile')
    // }

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
            consent: { sameAs: helpers.withMessage('Вы должны отдать согласие', sameAs(true)), }

        }
        
    }

    const $v = useVuelidate(rules, form)

    async function sendData(){
        if (form.value.isSending) return

        form.value.isSending = true

        setErrors({})


        // const emailCheck = helpers.withAsync(async value => {
        //     const response = await http.get(`/check-email?email=${value}`)
        // })

        $v.value.$touch()

        // console.log($v.value.data.email.$errors)

        if (!$v.value.$invalid){
            try{
                const response = await http.post('/register', form.value.data)
                router.push(`/verify-email?email=${encodeURIComponent(form.value.data.email)}`)
                console.log(response.data)
            }
            catch (error) {
                // console.log(error.response?.data)
                // form.value.errors.email.push(error.response?.data?.message)
                // console.log(form.value.errors.email)
                // console.log('a')
                console.log(error.response?.data)
                if (error.response?.data?.errors){
                    
                    setErrors(error.response?.data?.errors)
                }
            }
            
        }
        
        form.value.isSending = false
            
    }
</script>

<template>
    <div class="wrapper">
        <form class="registration-form" @submit.prevent="sendData()" novalidate>
            <span>Регистрация</span>
            <div class="register-fields">
                <div>
                    <label for="username">Имя пользователя</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        v-model="form.data.username"
                        autocomplete="off"
                        :class="{'error-input': hasErrors('email')}">
                    <span class="error" v-for="error of $v.data.username.$errors" :key="error.$uid">{{ error.$message }}</span>
                    <!-- <span class="error" v-for="error of form.errors.username" :key="error.$uid">{{ error.$message }}</span> -->
                </div>
                <div>
                    <label for="email">Email</label>
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

                    <!-- <div class="error" v-for="(error, index) in getErrors('general')" :key="index">
                        {{ error }}
                    </div> -->
                    <!-- <span class="error" v-for="error of $v.data.email.$errors" :key="error.$uid">{{ error.$message }}</span>
                    <span class="error" v-for="error of form.errors.email" :key="error.$uid">{{ error.$message }}</span> -->
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        v-model="form.data.password" 
                        @input="clearErrors('password')" 
                        :class="{'error-input': hasErrors('password')}"
                        autocomplete="off">
                    <!-- <span class="requirements">Требования к паролю...</span> -->
                    <p class="requirements">Пароль должен содержать хотя бы одну букву<br>Пароль должен содержать не менее 6 символов</p> 
                    <div class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                    <div class="error" v-for="(error, index) in getErrors('password')" :key="index">
                        {{ error }}
                    </div>


                    <!-- <span class="error" v-for="error of $v.data.password.$errors" :key="error.$uid">{{ error.$message }}</span> -->
                    <!-- <span class="error" v-for="error of form.errors.password" :key="error.$uid">{{ error.$message }}</span> -->
                </div>
                <div>
                    <div class="consent-wrapper">
                        <label for="consent">Согласие на обработку персональных данных</label>
                        <input type="checkbox" name="consent" id="consent" v-model="form.data.consent">
                    </div>
                    <div class="error" v-for="error of $v.data.consent.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>
            </div>
            <div class="have-account">
                <span>Есть аккаунт? </span>
                <RouterLink to="/">Войти</RouterLink>
            </div>
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
            width: 30vw;
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
            
            .consent-wrapper{
                display: flex;
                flex-direction: row !important;
                /* justify-content: center; */
                align-items: center;
                gap: 15px !important;
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

            input[type='checkbox']{
                width: 20px;
            }

            .requirements{
                font-size: 12px;
                color: rgb(135, 135, 135);
            }

            .error{
                color: red;
            }

            .error-input {
                border: 1px solid red !important;
            }
        }
    }
</style>