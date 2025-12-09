<script setup>
    defineProps({
        title: String,
        description: String,
    })

</script>

<template>
    <div class="card">
        <div class="image">
            <slot name="image"></slot>
        </div>
        <div class="info">
            <span>{{ title }}</span>
            <span class="additional-info">
                {{ description }}
            </span>
        </div>
    </div>
</template>

<style scoped>
    .card{
        padding: 10px 15px;
        border-radius: 5px;

        /* .artist-image{
            aspect-ratio: 1 / 1;
            width: 10vw;
            background-color: lightgray;
            border-radius: 100%;
            margin-bottom: 10px;
        } */

        .image{
            width: 10vw;
            margin-bottom: 10px;
        }

        .info{
            display: flex;
            flex-direction: column;
            gap: 5px;

            .additional-info{
                font-size: 12px;
            }
        }
    }

    .card:hover{
        background-color: rgb(70, 70, 70);
        cursor: pointer;
    }
</style>