<script setup>
    import ActionBar from '@/components/ActionBar.vue'
    import { onMounted, onUpdated, watch } from 'vue';
    import "../../node_modules/colorthief/dist/color-thief.umd.js"
    import { useRoute } from 'vue-router';
    import { useThemeStore } from '../stores/theme.js';
    
    const route = useRoute()

    const themeStore = useThemeStore()

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        explicit_content: {
            type: Boolean,
            default: false,
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

    // console.log(props)

    let colorThief = new ColorThief();
    
    function getDominantImageColor(){
        function isTooDark(rgb) {
            const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
            return luma < 50;
        }
        let topCard = document.querySelector(".top-card");
        let image = topCard.querySelector("img");
        image.crossOrigin = 'anonymous'
        // console.log(image)
        // console.log(image);
        // console.log(background);

        const setColor = () => {
            try{
                const color = colorThief.getColor(image);
                // const primaryColor = window.getComputedStyle(document.body).getPropertyValue('--bg-tertiary');

                // const finalColor = isTooDark(color) ? [100, 100, 100] : color;
                const finalColor = color

                topCard.style.setProperty('--card-accent-color', `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`);
            }
            catch (error){
                topCard.style.setProperty('--card-accent-color', 'rgb(100, 100, 100)');
            }
        }

        if (image.complete && image.naturalHeight !== 0) {
            setColor();
        } else {
            image.addEventListener('load', setColor, { once: true });
        }

        // image.addEventListener('load', function() {
            

            

        //     topCard.style.background = "linear-gradient(rgb(" + finalColor + "), " + primaryColor + ")";
        //     // topCard.style.background = `rgb(${color})`
            
        //     // console.log(color);
        //     // console.log(primaryColor);
        //     // console.log(topCard.style.background);
        // });
    }

    function updateBackgroundForTheme() {
        const topCard = document.querySelector(".top-card");
        if (topCard) {
            const currentColor = topCard.style.getPropertyValue('--card-accent-color');
            if (currentColor) {
                topCard.style.setProperty('--card-accent-color', currentColor);
            }
        }
    }

    onMounted(() => {
        if (themeStore.isDarkMode){
            getDominantImageColor();
        }
        else{
            const topCard = document.querySelector(".top-card");
            topCard.style.setProperty('--card-accent-color', 'var(--bg-tertiary)');
        }
    })

    watch(() => route.params.id, (newId) => {
        setTimeout(() => {
            if (themeStore.isDarkMode){
                getDominantImageColor();
            }
            else{
                const topCard = document.querySelector(".top-card");
                topCard.style.setProperty('--card-accent-color', 'var(--bg-tertiary)');
            }
        }, 50);
    });

    watch(() => themeStore.isDarkMode, () => {
        setTimeout(() => {
            if (themeStore.isDarkMode){
                getDominantImageColor();
            }
            else{
                const topCard = document.querySelector(".top-card");
                topCard.style.setProperty('--card-accent-color', 'var(--bg-tertiary)');
            }
        }, 100);
    })
    
</script>

<template>
    <div class="top-card">
        <div class="image">
            <slot name="image"></slot>
        </div>
        <div class="info">
            <div>
                <div class="title">
                    <span>{{ title }}</span>
                    <span v-if="explicit_content" class="explicit-badge" title="Нецензурная лексика">E</span>
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
    </div>
</template>

<style scoped>
    .top-card{
        /* --card-accent-color: rgb(100, 100, 100); */
        display: flex;
        gap: 20px;
        padding: 20px;
        background: linear-gradient(var(--card-accent-color), var(--bg-tertiary));

        .image{
            aspect-ratio: 1 / 1;
            width: 10vw;
        }

        .info{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            align-items: flex-start;

            :first-child{
                flex-grow: 1;
            }

            .title{
                font-size: 3rem;
                font-weight: bold;
                color: var(--text-primary);
                display: flex;
                gap: 15px;
                align-items: center;
            }
            
            .explicit-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                /* background-color: rgba(255, 255, 255, 0.15); */
                color: var(--text-primary);
                font-size: 24px;
                font-weight: bold;
                font-family: sans-serif;
                width: 28px;
                height: 28px;
                border-radius: 2px;
                border: 1px solid var(--border-hover);
                user-select: none;
                flex-shrink: 0;
            }

            .created{
                width: fit-content;
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                gap: 5px;
                
            }
        }

        .additional-info{
            font-size: 14px;
        }
    }
</style>
