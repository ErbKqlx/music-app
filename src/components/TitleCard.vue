<script setup>
    import ActionBar from '@/components/ActionBar.vue'
    import { onMounted, onBeforeUnmount, watch, ref, computed, nextTick } from 'vue';
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
    let observer = null;

    const colorThief = new ColorThief();

    function getLuminance(r, g, b) {
        const a = [r, g, b].map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function extractColor(imgElement) {
        if (!cardRef.value || !imgElement.src) return;

        if (!themeStore.isDarkMode) {
            setDefaultFallback();
            return;
        }

        if (imgElement.src === window.location.href || imgElement.src.endsWith('/') || imgElement.src === '') {
            return;
        }

        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous'; 
        
        tempImg.onload = () => {
            try {
                if (tempImg.naturalWidth === 0) return;
                let color = colorThief.getColor(tempImg);
                
                if (color) {
                    let [r, g, b] = color;
                    const luminance = getLuminance(r, g, b);
                    
                    if (luminance > 0.4) {
                        const darkenFactor = 0.35; 
                        r = Math.round(r * darkenFactor);
                        g = Math.round(g * darkenFactor);
                        b = Math.round(b * darkenFactor);
                    }
                    
                    const rgbString = `${r}, ${g}, ${b}`;
                    cardRef.value.style.setProperty('--card-accent-color', rgbString);
                }
            } catch (error) {
                console.error("ColorThief Error:", error);
                setDefaultFallback();
            }
        };

        tempImg.onerror = () => {
            setDefaultFallback();
        };

        tempImg.src = imgElement.src;
    }

    function setDefaultFallback() {
        if (!cardRef.value) return;
        
        if (themeStore.isDarkMode) {
            cardRef.value.style.setProperty('--card-accent-color', '26, 26, 26'); // #1a1a1a
        } else {
            cardRef.value.style.setProperty('--card-accent-color', 'var(--bg-tertiary)'); // #ffffff
        }
    }

    function getDominantImageColor() {
        if (!imageRef.value) return;

        const imgElement = imageRef.value.querySelector('img');
        
        if (!imgElement || !imgElement.src || imgElement.src === window.location.href) {
            setDefaultFallback();
            return;
        }

        extractColor(imgElement);
    }

    const updateBackground = () => {
        if (!cardRef.value) return;
        nextTick(() => {
            getDominantImageColor();
        });
    }

    onMounted(() => {
        updateBackground();

        if (imageRef.value) {
            observer = new MutationObserver((mutations) => {
                updateBackground();
            });
            
            observer.observe(imageRef.value, { 
                childList: true, 
                subtree: true, 
                attributes: true, 
                attributeFilter: ['src'] 
            });
        }
    })

    onBeforeUnmount(() => {
        if (observer) observer.disconnect();
    })

    watch(() => props.title, () => {
        nextTick(() => updateBackground());
    });

    watch(() => route.params.id, () => {
        nextTick(() => updateBackground());
    });

    watch(() => themeStore.isDarkMode, () => updateBackground());
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
                    <h1 :title="title">{{ title }}</h1>
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
        gap: 32px;
        padding: 40px 40px 60px 40px;
        
        background-color: rgb(var(--card-accent-color, 18, 18, 20)) !important;
        
        background-image: linear-gradient(
            to bottom, 
            rgba(var(--card-accent-color, 18, 18, 20), 0.9) 0%, 
            rgba(var(--card-accent-color, 18, 18, 20), 0.6) 60%, 
            rgba(var(--bg-tertiary, 18, 18, 20), 0) 100%
        ) !important;
        
        align-items: flex-end;
        transition: background 0.5s ease;
        min-height: 260px;
        position: relative;
        z-index: 1;
        
        .image-slot {
            aspect-ratio: 1 / 1;
            width: 230px;
            height: 230px;
            min-width: 230px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.6);
            border-radius: 8px; 
            overflow: hidden; 
            display: flex;
            transition: transform 0.3s ease;
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

            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
            
            .content-type-badge {
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1px;
                color: var(--text-primary);
                opacity: 0.9;
            }

            .title {
                display: flex;
                gap: 15px;
                align-items: center;
                width: 100%;
                
                h1 {
                    font-size: clamp(2.2rem, 4.5vw, 5rem);
                    font-weight: 900;
                    margin: 8px 0;
                    
                    color: var(--text-primary, #fff); 
                    
                    line-height: 1.1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    letter-spacing: -1px;

                    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
                }
            }
            
            .explicit-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 700;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                user-select: none;
                flex-shrink: 0;
            }

            .metadata {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 8px;
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
            }
        }

        .actions {
            margin-top: 24px;
        }
    }

    @media (max-width: 768px) {
        .top-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 24px;
            
            .image-slot {
                width: 180px;
                height: 180px;
                min-width: 180px;
            }
            
            .info {
                align-items: center;
                width: 100%;
                
                .title {
                    justify-content: center;
                }
            }
        }
    }
</style>