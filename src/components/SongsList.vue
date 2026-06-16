<script setup>

</script>

<template>
    <div class="songs-list-container">
        <div class="songs-list-header">
            <div class="header-index">№</div>
            <div class="header-image"></div> 
            <div class="header-title">Название</div>
            <div class="header-album">Дата релиза</div>
            <div class="header-duration" title="Длительность">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>
            </div>
            <div class="header-actions"></div> 
        </div>

        <hr class="header-divider" />

        <div class="songs-list">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .songs-list-container {
        padding: 0 12px;
        padding-bottom: 16px;
    }

    .songs-list-header {
        display: grid;
        grid-template-columns: 40px 56px minmax(0, 3fr) minmax(0, 2fr) 70px 40px; 
        gap: 20px;
        
        padding: 8px 16px; 
        
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-secondary, #727272);
        align-items: center;
    }

    .header-index {
        display: flex;
        justify-content: center;
    }

    .header-duration {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: var(--text-secondary, #727272);
    }

    .header-divider {
        border: none;
        height: 1px;
        background-color: var(--border-hover, rgba(255, 255, 255, 0.1));
        margin: 4px 16px 12px 16px; 
    }

    .songs-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
</style>