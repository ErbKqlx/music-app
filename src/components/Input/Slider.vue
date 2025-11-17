<script setup>

</script>

<template>
    <div class='slider'>
        <input class='range-input' type='range' min='0' max='1000' value='0' step='1'>
    </div>
</template>

<style scoped>
    .slider{
        width: 100%;
        display: flex;
    }

    .slider .range-input{
        width: 100%;
        background-color: lightgray;
        border-radius: 20px;
        height: 6px;
        appearance: none;
        align-self: center;
    }

    .slider .range-input:hover{
        cursor: pointer;
    }

    .slider .range-input::-webkit-slider-runnable-track{
        background-color: white;
        border-radius: 10px;
        height: 6px;
    }

    .slider .range-input::-webkit-slider-thumb{
        -webkit-appearance: none;
        background-color: gray;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: translateY(-3px);
    }

    .slider .range-input::-webkit-slider-progress{
        background-color: gray;
        border-radius: 10px;
        height: 6px;
    }
</style>