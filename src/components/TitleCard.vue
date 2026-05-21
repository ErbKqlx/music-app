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

                const finalColor = isTooDark(color) ? [100, 100, 100] : color;

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

    // onMounted(() => {
    //     getDominantImageColor();
        
    // })

    // watch(() => route.params.id, (newId) => {
    //     setTimeout(() => {
    //         getDominantImageColor();
    //     }, 50);
    // });

    // watch(() => themeStore.isDarkMode, () => {
    //     setTimeout(() => {
    //         updateBackgroundForTheme();
    //     }, 100);
    // })
    
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
        /* background: linear-gradient(var(--card-accent-color), var(--bg-tertiary)); */

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
<!-- 
<script setup>
    import ActionBar from '@/components/ActionBar.vue'
    import { onMounted, watch, ref } from 'vue';
    import "../../node_modules/colorthief/dist/color-thief.umd.js"
    import { useRoute } from 'vue-router';
    import { useThemeStore } from '@/stores/theme';
    
    const route = useRoute()
    const themeStore = useThemeStore();
    
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
    
    let colorThief = new ColorThief();
    const accentColor = ref('80, 80, 80'); // Храним RGB значения без rgb()
    
    function getDominantImageColor(){
        function isTooDark(rgb) {
            const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
            return luma < 50;
        }
        
        let topCard = document.querySelector(".top-card");
        if (!topCard) return;
        
        let image = topCard.querySelector("img");
        if (!image) return;
        
        image.crossOrigin = 'anonymous'
        
        const updateColor = () => {
            try {
                const color = colorThief.getColor(image);
                const finalColor = isTooDark(color) ? [80, 80, 80] : color;
                accentColor.value = `${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]}`;
            } catch (error) {
                console.error('Error:', error);
                accentColor.value = '80, 80, 80';
            }
        };
        
        if (image.complete && image.naturalHeight !== 0) {
            updateColor();
        } else {
            image.addEventListener('load', updateColor, { once: true });
        }
    }
    
    onMounted(() => {
        getDominantImageColor();
    })
    
    watch(() => themeStore.isDarkMode, () => {
        // Тема меняется, но градиент обновится через CSS переменные
    });
    
    watch(() => route.params.id, () => {
        setTimeout(() => {
            getDominantImageColor();
        }, 100);
    });
</script>

<template>
    <div 
        class="top-card" 
        :style="{ '--accent-color-rgb': accentColor }"
    >
        <div class="image">
            <slot name="image"></slot>
        </div>
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
    </div>
</template> -->

<!-- <style>
/* Глобальный стиль для поддержки анимации градиента */
@property --accent-color-rgb {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(80, 80, 80);
}

@property --bg-tertiary-rgb {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(20, 20, 20);
}
</style>

<style scoped>
    .top-card {
        --accent-color-rgb: 80, 80, 80;
        display: flex;
        gap: 20px;
        padding: 20px;
        background: linear-gradient(
            rgb(var(--accent-color-rgb)), 
            var(--bg-tertiary)
        );
        transition: --accent-color-rgb 0.5s ease, background 0.5s ease;
    }
    
    /* Hover эффект для усиления плавности */
    .top-card:hover {
        transition: --accent-color-rgb 0.3s ease, background 0.3s ease;
    }
    
    .top-card .image{
        aspect-ratio: 1 / 1;
        width: 10vw;
        min-width: 120px;
    }
    
    .top-card .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }

    .top-card .info{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: flex-start;
    }

    .top-card .info :first-child{
        flex-grow: 1;
    }

    .top-card .info .title{
        font-size: 3rem;
        font-weight: bold;
        word-break: break-word;
    }

    .top-card .info .created{
        width: fit-content;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 5px;
    }

    .top-card .additional-info{
        font-size: 14px;
    }
    
    @media (max-width: 768px) {
        .top-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .top-card .image {
            width: 50%;
            min-width: 150px;
        }
        
        .top-card .info {
            align-items: center;
        }
        
        .top-card .info .created {
            align-items: center;
        }
    }
</style> -->