<script setup>
    // defineProps({
    //     value: String,
    // })
</script>

<template>
    <button>
        <span>
            <slot></slot>
        </span>
    </button>
</template>

<style scoped>
    button{
        padding: 7px 14px;
        /* min-width: 50px; */
        /* height: 25px; */
        border-radius: 20px;
        border: none;
        /* width: 100%; */

        span{
            display: flex;
            align-items: center;
            justify-content: center;
        }

        span :deep(svg){
            width: 1.25rem;
            height: 1.25rem;
        }
    }

    .no-background{
        background: none !important;
    }

    .round-button{
        padding: 7px;
    }
    
    button:hover{
        background-color: lightgray;
        cursor: pointer;
        transform: scale(1.1);
        transition: transform 0.2s;
    }

    button:active{
        /* background-color: gray; */
        background-color: var(--active-color);
    }

    /* .round-button{
        border-radius: 50%;
    } */
</style>