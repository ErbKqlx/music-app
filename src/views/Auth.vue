<script setup>
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';
    import router from '@/router/index.js'

    function toProfile(){
        router.push('/profile')
    }
</script>

<template>
    <div class="wrapper">
        <form class="authorization-form">
            <span>Авторизация</span>
            <div class="auth-fields">
                <div>
                    <label for="login-email">Логин или Email</label>
                    <!-- <input type="text" id="login-email"> -->
                    <Input type="text" id="login-email" name="login-email"/>
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <!-- <input type="text" id="password"> -->
                    <Input type="password" id="password" name="password"/>
                </div>
            </div>
            <div class="no-account">
                <span>Нет аккаунта? </span>
                <!-- <a href="registration.html">Зарегистрироваться</a> -->
                <RouterLink to="/register">Зарегистрироваться</RouterLink>
            </div>
            <!-- <input type="submit" value="Войти в аккаунт"> -->
            <SubmitButton @click="toProfile"/>
            <!-- <a class="forgot-password" href="#">Забыли пароль?</a> -->
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
        }
    }
</style>