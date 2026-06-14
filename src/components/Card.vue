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
    explicitContent: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="card">
        <div class="image">
            <slot name="image"></slot>
        </div>
        <div class="info">
            <div class="title-wrapper">
                <span :title="title">{{ title }}</span>
                <span v-if="explicitContent" class="explicit-badge" title="Нецензурная лексика">E</span>
            </div>
            <span class="additional-info" :title="description">
                {{ description }}
            </span>
        </div>
    </div>
</template>

<style scoped>
    .card {
        padding: 14px;
        border-radius: 8px;
        width: 220px;
        background-color: transparent;
        transition: background-color 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 12px;
        user-select: none;

        .image {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            background-color: var(--bg-secondary, #282828);
            
            & :deep(img) {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
                display: block;
            }
        }

        .info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 700;
            min-width: 0;

            .title-wrapper {
                display: flex;
                align-items: center;
                gap: 6px;
                width: 100%;
                min-width: 0;

                span:first-child {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex-shrink: 1;
                    min-width: 0;
                }
            }
            
            .explicit-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary, #b3b3b3);
                font-size: 10px;
                font-weight: 700;
                
                height: 16px;
                aspect-ratio: 1 / 1; 
                
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.15);
                
                flex-shrink: 0;
                flex-grow: 0;
                
                line-height: 1;
            }

            .additional-info {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-secondary, #b3b3b3);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .card:hover {
        background-color: var(--bg-hover);
        cursor: pointer;
    }
</style>