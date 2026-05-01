import { ref } from 'vue'

export function useFormErrors() {
    const errors = ref({})
    
    const setErrors = (fieldErrors) => {
        errors.value = {}
        addErrors(fieldErrors)
    }
    
    const addErrors = (fieldErrors) => {
        for (const [field, messages] of Object.entries(fieldErrors)) {
            if (!errors.value[field]) {
                errors.value[field] = []
            }
            const messagesArray = Array.isArray(messages) ? messages : [messages]
            errors.value[field].push(...messagesArray)
        }
    }
    
    const addError = (field, message) => {
        if (!errors.value[field]) {
            errors.value[field] = []
        }
        errors.value[field].push(message)
    }
    
    const clearErrors = (field) => {
        if (field) {
            errors.value[field] = []
        } else {
            errors.value = {}
        }
    }
    
    const hasErrors = (field) => {
        if (field) {
            return errors.value[field] && errors.value[field].length > 0
        }
        return Object.values(errors.value).some(arr => arr.length > 0)
    }
    
    const getErrors = (field) => {
        return errors.value[field] || []
    }
    
    return {
        errors,
        setErrors,
        addErrors,
        addError,
        clearErrors,
        hasErrors,
        getErrors,
    }
}