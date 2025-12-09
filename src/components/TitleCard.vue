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
        <!-- <div class="image"> -->
            <!-- <img src="" alt="Аватар"> -->
        <!-- </div> -->
        <div class="image">
            <slot name="image"></slot>
        </div>
        <!-- <Image/> -->
        <div class="info">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <div class="created">
                <RouterLink to="/artist" class="additional-info clickable">{{ created_by }}</RouterLink>
                <span class="additional-info">{{ created_at }}</span>
            </div>
        </div>
        <!-- <span class="additional-info clickable">{{ created_by }}</span> -->
    </div>
</template>

<style scoped>
    .top-card{
        /* --avg-color меняется в зависимости от обложки */
        /* background: linear-gradient(--avg-color, rgb(20, 20, 20)); */
        /* background: linear-gradient(rgb(55, 55, 55), rgb(20, 20, 20)); */
        background: linear-gradient(rgb(55, 55, 55), var(--primary-color));
        display: flex;
        gap: 20px;
        padding: 20px;

        .image{
            aspect-ratio: 1 / 1;
            width: 10vw;
        }

        .info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            /* width: 100%; */
            min-height: 100%;

            .title{
                font-size: 3rem;
                font-weight: bold;
                flex-grow: 1;
            }

            .created{
                display: flex;
                flex-direction: column;
                gap: 5px;
                justify-content: space-between;
            }
        }

        .additional-info{
            font-size: 14px;
        }
    }
</style>