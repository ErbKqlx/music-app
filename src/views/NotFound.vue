<script setup>
import { RouterLink } from 'vue-router';

    defineProps({
        code: String,
        message: String
    })

    const errorMessages = ['Эта пластинка потерялась...', 'Тишина... здесь нет музыки']
</script>

<template>
    <div class="wrapper">
        <div class="error-info">
            <span class="error-code">404</span>
            <span class="error-message">{{errorMessages[Math.floor(Math.random() * errorMessages.length)]}}</span>
            <RouterLink to="/" class="additional-info">Вернуться на профиль</RouterLink>
        </div>
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
    }

    .error-info{
        display: flex;
        flex-direction: column;

        .error-code{
            text-align: center;
            font-size: 96px;
        }

        .error-message{
            font-size: 24px;
        }

        .error-code, .error-message{
            color: white;
            font-weight: bold;
            font-family: Inter;
        }
    }

    .additional-info{
        margin-top: 50px;
        text-align: center;
    }
</style>