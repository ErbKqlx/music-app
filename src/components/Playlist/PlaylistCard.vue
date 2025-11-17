<script setup>
    defineProps({
        title: String,
        description: String
    })
</script>

<template>
    <div class="playlist-card">
        <div class="playlist-image">
            <!-- <img src="" alt="Изображение плейлиста"> -->
            <div class="image"></div>
        </div>
        <div class="playlist-info">
            <span class="playlist-name">{{ title }}</span>
            <span class="playlist-description additional-info">{{ description }}</span>
            <div class="playlist-created-by">
                <span class='additional-info'>Кем создан</span>
                <span class='additional-info'>|</span>
                <span class='additional-info'>Когда создан</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .playlist-card{
        display: flex;
        background-color: rgb(70, 70, 70);
        min-height: 30vh;
    
        .playlist-image{
            display: flex;
            aspect-ratio: 1 / 1;
            min-width: 15vw;
            height: 100%;
            padding: 20px;

            .image{
                align-self: center;
                aspect-ratio: 1 / 1;
                /* width: 225px;
                height: 225px; */
                width: 100%;
                background-color: lightgrey;
                border-radius: 10px;
            }
        }

        .playlist-info{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 0;
        
            /*span{
                color: lightgray;
            }*/
        
            .playlist-name{
                font-size: 2rem;
                font-weight: bold;
                color: white;
            }
        
            .playlist-description{
                flex-grow: 1;
            }
        
            .playlist-created-by{
                justify-self: flex-end;
            }
        }
    }
</style>