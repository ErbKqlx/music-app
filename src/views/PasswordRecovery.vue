<script setup>
    import router from '@/router/index.js'
    import Input from '@/components/Input/Input.vue';
    import SubmitButton from '@/components/Input/SubmitButton.vue';

    function toProfile(){
        router.push('/profile')
    }
</script>

<template>
    <div class="wrapper">
        <form class="password-recovery-form">
            <div class="form-title">
                <span>Восстановление пароля</span>
                <span class="description">Введите свою почту, к которой привязан ваш аккаунт</span>
            </div>
            <div class="password-recovery-fields">
                <div>
                    <label for="email">Почта</label>
                    <Input type="email" id="email" name="email"/>
                </div>
            </div>
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

        .password-recovery-form{
            /* display: flex;
            flex-direction: column; */
            min-width: 25vw;
            min-height: 33vh;
            /* gap: 10px; */

            .form-title{
                display: flex;
                flex-direction: column;
                font-size: 32px;
                align-items: center;
                margin-bottom: 20px;

                .description{
                    font-size: 12px;
                    color: rgb(135, 135, 135);
                }
            }

            .password-recovery-fields{
                /* display: flex;
                flex-direction: column; */
                /* gap: 20px; */
                margin-bottom: 35px;
            }

            .password-recovery-fields div{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            /* label{
                color: white;
                font-family: Inter;
            } */

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
                width: 100%;
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