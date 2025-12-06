<script setup>
    import PlaylistsAside from '@/components/Aside/PlaylistsAside.vue';
</script>

<template>
    <div class="wrapper">
        <PlaylistsAside/>
        <main>
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
    .wrapper{
        padding: 0 10px;
        display: flex;
        flex-wrap: nowrap;
        gap: 10px;
        flex-grow: 1;

        main{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
    }
</style>