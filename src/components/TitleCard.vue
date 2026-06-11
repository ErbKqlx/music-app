<script setup>
    import ActionBar from '@/components/ActionBar.vue'
    import { onMounted, watch, ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useThemeStore } from '../stores/theme.js';
    import "../../node_modules/colorthief/dist/color-thief.umd.js"

    const props = defineProps({
        type: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: ''
        },
        explicitContent: {
            type: Boolean,
            default: false
        }
    })

    const typeTranslations = {
        playlist: 'Плейлист',
        song: 'Трек',
        artist: 'Исполнитель',
        profile: 'Профиль'
    }

    const localizedType = computed(() => {
        return typeTranslations[props.type] || props.type
    })

    const route = useRoute()
    const themeStore = useThemeStore()

    const cardRef = ref(null)
    const imageRef = ref(null)

    const colorThief = new ColorThief();

    function getDominantImageColor() {
        if (!cardRef.value || !imageRef.value) return;

        const imgElement = imageRef.value.querySelector('img');
        if (!imgElement) return;

        imgElement.crossOrigin = 'anonymous';

        const setColor = () => {
            try {
                const color = colorThief.getColor(imgElement);
                cardRef.value.style.setProperty('--card-accent-color', `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
            } catch (error) {
                cardRef.value.style.setProperty('--card-accent-color', 'rgb(100, 100, 100)');
            }
        }

        if (imgElement.complete && imgElement.naturalHeight !== 0) {
            setColor();
        } else {
            imgElement.addEventListener('load', setColor, { once: true });
        }
    }

    const updateBackground = () => {
        if (!cardRef.value) return;
        
        if (themeStore.isDarkMode) {
            getDominantImageColor();
        } else {
            cardRef.value.style.setProperty('--card-accent-color', 'var(--bg-tertiary)');
        }
    }

    onMounted(() => updateBackground())
    watch(() => route.params.id, () => setTimeout(updateBackground, 50));
    watch(() => themeStore.isDarkMode, () => setTimeout(updateBackground, 100));
</script>

<template>
    <div ref="cardRef" class="top-card" :class="[`type-${type}`]">
        <div ref="imageRef" class="image-slot">
            <slot name="image"></slot>
        </div>
        <div class="info">
            <div class="header-content">
                <span class="content-type-badge">{{ localizedType.toUpperCase() }}</span>
                
                <div class="title">
                    <h1>{{ title }}</h1>
                    <span v-if="explicitContent" class="explicit-badge" title="Нецензурная лексика">E</span>
                </div>

                <div class="metadata">
                    <slot name="metadata"></slot>
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
    .top-card {
        display: flex;
        gap: 24px;
        padding: 24px;
        background: linear-gradient(var(--card-accent-color, var(--bg-tertiary)), var(--bg-tertiary));
        align-items: flex-end;
        
        .image-slot {
            aspect-ratio: 1 / 1;
            
            width: 192px; 
            height: 192px;
            min-width: 192px;
            
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            
            border-radius: 6px; 
            overflow: hidden; 
            display: flex;
        }

        &.type-artist .image-slot,
        &.type-profile .image-slot {
            border-radius: 50%;
        }

        .image-slot :deep(img) {
            display: block;
            
            width: 100% !important;
            height: 100% !important;
            
            object-fit: cover !important; 
            
            margin: 0 !important;
        }

        .info {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            flex-grow: 1;
            min-width: 0;
            
            .content-type-badge {
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
                color: var(--text-primary);
                opacity: 0.7;
            }

            .title {
                display: flex;
                gap: 15px;
                align-items: center;
                width: 100%;
                
                h1 {
                    font-size: clamp(2rem, 4vw, 4.5rem);
                    font-weight: 800;
                    margin: 4px 0;
                    color: var(--text-primary);
                    line-height: 1.1;
                    
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            
            .explicit-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                font-size: 18px;
                font-weight: bold;
                width: 24px;
                height: 24px;
                border-radius: 3px;
                border: 1px solid var(--border-hover);
                user-select: none;
            }

            .metadata {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 8px;
                font-size: 14px;
                color: var(--text-primary);
                
                /* :deep(> *:not(:last-child)::after) {
                    content: "•";
                    margin-left: 8px;
                    display: inline-block;
                    opacity: 0.6;
                } */
            }
        }

        .actions {
            margin-top: 24px;
        }
    }
</style>