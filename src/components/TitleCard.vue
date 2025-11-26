<script setup>
    import Image from '@/components/Image.vue';

    defineProps({
        title: String,
        created_by: String,
        created_at: Date,
    })
</script>

<template>
    <div class="top-card">
        <div class="image">
            <!-- <img src="" alt="Аватар"> -->
        </div>
        <!-- <Image/> -->
        <div class="info">
            <span class="title">{{ title }}</span>
            <div>
                <RouterLink to="/artist" class="additional-info clickable">{{ created_by }}</RouterLink>
                <span class="additional-info">{{ created_at }}</span>
            </div>
            
        </div>
        <!-- <span class="additional-info clickable">{{ created_by }}</span> -->
    </div>
</template>

<style scoped>
    .top-card{
        background-color: rgb(55, 55, 55);
        display: flex;
        gap: 20px;
        padding: 20px;

        .image{
            /* position: absolute; */
            border-radius: 100%;
            aspect-ratio: 1 / 1;
            min-height: 10vw;
            background-color: lightgray;
        }

        .info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .title{
            font-size: 3rem;
            font-weight: bold;
        }

        .additional-info{
            font-size: 14px;
        }
    }
</style>