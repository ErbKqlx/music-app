<script setup>
    import Image from '@/components/Image.vue'

    defineProps({
        title: String,
        count: Number
    })
</script>

<template>
    <div class="playlist-card">
        <div class="image">
            <Image/>
        </div>
        <div class="playlist-info">
            <span>{{title}}</span>
            <span class="additional-info">{{count}} трек</span>
        </div>
    </div>
</template>

<style scoped>
    .playlist-card{
        display: flex;
        gap: 10px;
        font-size: 14px;
        padding: 7px 5px;
        border-radius: 5px;

        .image{
            /* background-color: lightgray; */
            aspect-ratio: 1 / 1;
            width: 15%;
            overflow: hidden;
        }

        .playlist-info{
            display: flex;
            flex-direction: column;
            align-self: center;
            gap: 3px;
            flex-grow: 1;

            :last-child{
                font-size: 12px;
            }
        }
    }

    .playlist-card:hover{
        background-color: rgb(70, 70, 70);
        cursor: pointer;
    }
</style>