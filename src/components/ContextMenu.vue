<script setup>
    import { useContextMenuStore } from '@/stores/contextMenu.js';
    import { ref, watch, nextTick } from 'vue';

    const contextMenuStore = useContextMenuStore();
    const menuRef = ref(null);
    const pos = ref({ x: 0, y: 0 });

    watch(() => [contextMenuStore.isOpen, contextMenuStore.x, contextMenuStore.y], async () => {
        if (!contextMenuStore.isOpen) return;
        
        await nextTick();

        if (menuRef.value) {
            let newX = contextMenuStore.x;
            let newY = contextMenuStore.y;
            const { offsetWidth: w, offsetHeight: h } = menuRef.value;

            if (newX + w > window.innerWidth) newX -= w;
            if (newY + h > window.innerHeight) newY -= h;

            pos.value = { x: newX, y: newY };
        }
    });
</script>

<template>
  <Teleport to="body">
    <div 
        v-if="contextMenuStore.isOpen" 
        class="context-overlay" 
        @click="contextMenuStore.close" 
        @contextmenu.prevent="contextMenuStore.close">
    <div 
            ref="menuRef"
            class="menu-content"
            :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
            @click.stop>
        <div 
            v-for="(item, i) in contextMenuStore.options" 
            :key="i"
            class="menu-item"
            :class="{ danger: item.danger }"
            @click="item.action(); contextMenuStore.close()">
                {{ item.label }}
        </div>
    </div>
    </div>
  </Teleport>
</template>

<style scoped>
    .context-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
    }

    .menu-content {
        position: fixed;
        background: #242424;
        border: 1px solid #333;
        border-radius: 6px;
        padding: 4px;
        min-width: 180px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .menu-item {
        padding: 10px 14px;
        cursor: pointer;
        color: #eee;
        border-radius: 4px;
        font-size: 14px;
    }

    .menu-item:hover { 
        background: #333; 
    }

    .menu-item.danger { 
        color: #ff5555; 
    }
</style>