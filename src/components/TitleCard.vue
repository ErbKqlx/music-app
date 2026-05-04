<script setup>
    import ActionBar from '@/components/ActionBar.vue'
    import { onMounted, onUpdated } from 'vue';
    import "../../node_modules/colorthief/dist/color-thief.umd.js"
    
    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        id_user: {
            type: Number
        },
        username: {
            type: String,
            default: '',
        },
        created_at: {
            type: Date,
            default: '',
        },
        hasActions: {
            type: Boolean,
            default: false,
        },
    })

    console.log(props)

    let colorThief = new ColorThief();
    
    function getDominantImageColor(){
        function isTooDark(rgb) {
            const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
            return luma < 50;
        }
        let topCard = document.querySelector(".top-card");
        let image = topCard.querySelector("img");
        image.crossOrigin = 'anonymous'
        console.log(image)
        // console.log(image);
        // console.log(background);
        image.addEventListener('load', function() {
            const color = colorThief.getColor(image);
            const primaryColor = window.getComputedStyle(document.body).getPropertyValue('--primary-color');

            const finalColor = isTooDark(color) ? [100, 100, 100] : color;

            topCard.style.background = "linear-gradient(rgb(" + finalColor + "), " + primaryColor + ")";
            // topCard.style.background = `rgb(${color})`
            
            console.log(color);
            console.log(primaryColor);
            console.log(topCard.style.background);
        });
    }

    onMounted(() => {
        getDominantImageColor();
    })

    onUpdated(() => {
        getDominantImageColor();
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
            <div>
                <div class="title">
                    <span>{{ title }}</span>
                </div>
                <div class="created">
                    <RouterLink :to="'/profile/' + id_user" class="additional-info clickable">{{ username }}</RouterLink>
                    <span class="additional-info">{{ created_at }}</span>
                </div>
            </div>
            <div class="actions">
                <ActionBar>
                    <slot name="actions"></slot>
                </ActionBar>
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
        /* background: linear-gradient(rgb(55, 55, 55), var(--primary-color)); */
        display: flex;
        gap: 20px;
        padding: 20px;

        .image{
            aspect-ratio: 1 / 1;
            width: 10vw;
            /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); */
        }

        .info{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: flex-start;
            /* gap: 5px; */
            /* width: 100%; */
            /* min-height: 100%; */

            :first-child{
                flex-grow: 1;
            }

            .title{
                font-size: 3rem;
                font-weight: bold;
                /* flex-grow: 1; */
            }

            .created{
                width: fit-content;
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