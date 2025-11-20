<script setup>

</script>

<template>
    <div class="wrapper">
        <div class="error-info">
            <span class="error-code">404</span>
            <span class="error-message">Страница не найдена</span>
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
</style>