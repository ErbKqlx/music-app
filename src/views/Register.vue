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
        <form class="registration-form">
            <span>Регистрация</span>
            <div class="register-fields">
                <div>
                    <label for="login">Логин</label>
                    <Input type="text" id="login" name="login"/>
                </div>
                <div>
                    <label for="email">Email</label>
                    <Input type="text" id="email" name="email"/>
                </div>
                <div>
                    <label for="password">Пароль</label>
                    <Input type="password" id="password" name="password"/>
                    <span class="requirements">Требования к паролю</span>
                </div>
            </div>
            <div class="have-account">
                <span>Есть аккаунт? </span>
                <RouterLink to="/auth">Войти</RouterLink>
                <!-- <a href="auth.html">Войти</a> -->
            </div>
            <!-- <input type="submit" value="Создать аккаунт"> -->
            <SubmitButton @click="toProfile"/>
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
        }
    }
</style>