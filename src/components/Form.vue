<script setup>
    import Input from '@/components/Input/Input.vue'
</script>

<template>
    <!-- Потом переделать -->
    <form>
        <div class="fields">
            <div>
                <label for="name">Название</label>
                <Input type="text" id="name" name="name"/>
            </div>
            <div>
                <label for="public">Открытый</label>
                <input type="checkbox" name="public" id="public">
            </div>
        </div>
    </form>
</template>

<style scoped>
    .fields{
        width: 100%;

        > div{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            margin-bottom: 20px;
        }
    }
</style>