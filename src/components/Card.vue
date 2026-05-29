<script setup>
    defineProps({
        title: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
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
        width: 220px;
        

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
            color: var(--text-primary);

            font-size: 20px;

            span{
                white-space: nowrap;
            
                overflow: hidden;
                text-overflow: ellipsis;
            }
            

            .additional-info{
                font-size: 14px;
            }
        }
    }

    .card:hover{
        /* background-color: rgb(70, 70, 70); */
        background-color: var(--bg-hover);
        cursor: pointer;
    }
</style>