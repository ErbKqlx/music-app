<script setup>
    import { ref } from 'vue'
    import Modal from '@/components/Modal.vue'
    import 'cropperjs'

    const props = defineProps({
        imageSrc: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            default: 'image/jpeg'
        }
    })

    const emit = defineEmits(['confirmed', 'cancel'])

    const cropperRef = ref(null)

    function onCropperReady() {
        if (!cropperRef.value) return
        const selection = cropperRef.value.querySelector('cropper-selection')
        if (selection) {
            selection.movable = true
            selection.resizable = true
            selection.setAttribute('action', 'move')
            selection.bounds = 'Position' 
            selection.setAttribute('bounds', 'Position')
        }
    }

    async function saveCroppedImage() {
        if (!cropperRef.value) return

        try {
            const selection = cropperRef.value.querySelector('cropper-selection')
            if (!selection) return

            const croppedCanvas = await selection.$toCanvas()

            if (croppedCanvas) {
                const dataUrl = croppedCanvas.toDataURL(props.fileType, 0.9)

                const blob = await new Promise((resolve) => {
                    croppedCanvas.toBlob((b) => resolve(b), props.fileType, 0.9)
                })

                if (blob) {
                    const extension = props.fileType.split('/')[1] || 'jpg'
                    const fileName = `cover.${extension}`
                    const croppedFile = new File([blob], fileName, { type: props.fileType })
                    
                    emit('confirmed', { dataUrl, file: croppedFile })
                }
            }
        } catch (error) {
            console.error('Ошибка при обрезке:', error)
            alert('Не удалось обработать изображение.')
        }
    }
</script>

<template>
    <Modal @close="emit('cancel')">
        <template #header>
            <h3 class="cropper-title">Редактирование обложки</h3>
        </template>

        <template #body>
            <div class="cropper-area">
                <cropper-area>
                    <cropper-canvas ref="cropperRef" background @canvas:ready="onCropperReady">
                        <cropper-image :src="imageSrc" alt="Редактирование" policy="cover"></cropper-image>
                        <cropper-shade></cropper-shade>
                        
                        <cropper-selection 
                            aspect-ratio="1" 
                            initial-coverage="1" 
                            action="move" 
                            movable 
                            resizable
                            bounds="Position">
                            
                            <cropper-handle action="ne-resize"></cropper-handle>
                            <cropper-handle action="nw-resize"></cropper-handle>
                            <cropper-handle action="se-resize"></cropper-handle>
                            <cropper-handle action="sw-resize"></cropper-handle>
                            
                        </cropper-selection>
                    </cropper-canvas>
                </cropper-area>
            </div>
        </template>

        <template #footer>
            <div class="crop-actions">
                <button type="button" class="btn-crop-cancel" @click="emit('cancel')">Отмена</button>
                <button type="button" class="btn-crop-confirm" @click="saveCroppedImage">Применить</button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .cropper-title {
        color: var(--text-primary);
    }

    .cropper-area {
        width: 400px;
        height: 400px;
        max-width: 100%;
        background-color: #1e1e1e;
        overflow: hidden;
        border-radius: 6px;
    }

    .cropper-area cropper-canvas {
        width: 100%;
        height: 100%;
        display: block;
    }

    .crop-actions {
        display: flex;
        gap: 12px;
    }

    .btn-crop-confirm, .btn-crop-cancel {
        padding: 8px 18px;
        border-radius: 20px;
        cursor: pointer;
        border: none;
        font-weight: 500;
        font-size: 14px;
    }

    .btn-crop-confirm {
        background-color: var(--accent-color);
        color: white;
    }

    .btn-crop-cancel {
        background-color: transparent;
        color: var(--text-secondary, #9ca3af);
        border: 1px solid var(--border-hover, #374151);
    }
    
    :deep(cropper-selection) {
        --grid-line-color: rgba(255, 255, 255, 0.95);
        background-image: 
            linear-gradient(to bottom, transparent 33.33%, var(--grid-line-color) 33.33%, var(--grid-line-color) calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent 66.66%, var(--grid-line-color) 66.66%, var(--grid-line-color) calc(66.66% + 1px), transparent calc(66.66% + 1px)),
            linear-gradient(to right, transparent 33.33%, var(--grid-line-color) 33.33%, var(--grid-line-color) calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent 66.66%, var(--grid-line-color) 66.66%, var(--grid-line-color) calc(66.66% + 1px), transparent calc(66.66% + 1px)) !important;
        filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.8));
    }

    :deep(cropper-handle) {
        z-index: 10 !important;
        pointer-events: auto !important;
    }

    :deep(cropper-selection) {
        pointer-events: auto !important;
        cursor: move;
    }

    :deep(cropper-handle) {
        display: block !important;
        position: absolute;
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        width: 12px !important;
        height: 12px !important;
        opacity: 1 !important;
        z-index: 9999 !important;
        pointer-events: auto !important;
    }

    :deep(cropper-handle[action="nw-resize"]) { top: -6px; left: -6px; cursor: nwse-resize; }
    :deep(cropper-handle[action="ne-resize"]) { top: -6px; right: -6px; cursor: nesw-resize; }
    :deep(cropper-handle[action="sw-resize"]) { bottom: -6px; left: -6px; cursor: nesw-resize; }
    :deep(cropper-handle[action="se-resize"]) { bottom: -6px; right: -6px; cursor: nwse-resize; }
</style>