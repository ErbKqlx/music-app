<script setup>
    import Image from '@/components/Image.vue'

    defineProps({
        image_url: String,
        title: String,
        count: Number,
    })
</script>

<template>
    <div class="playlist-card">
        <div class="image">
            <Image :url="image_url"/>
        </div>
        <div class="playlist-info">
            <span>{{title}}</span>
            <!-- <span class="additional-info">Треков: {{count}}</span> -->
             <span class="additional-info">Треков: 0</span>
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
        color: var(--text-primary);

        .image{
            /* background-color: lightgray; */
            aspect-ratio: 1 / 1;
            max-width: 100px;
            overflow: hidden;
        }

        .playlist-info{
            display: flex;
            flex-direction: column;
            align-self: center;
            gap: 3px;
            flex-grow: 1;

            white-space: nowrap;
            overflow: hidden;

            span{
                text-wrap: wrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            

            :first-child{
                font-size: 24px;
            }
            
            :last-child{
                font-size: 16px;
            }
        }
    }

    .playlist-card:hover{
        /* background-color: rgb(70, 70, 70); */
        /* background-color: var(--secondary-color); */
        background-color: var(--bg-hover);
        cursor: pointer;
    }
</style>