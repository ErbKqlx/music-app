export function formatDate(dateString, includeTime = false) {
    if (!dateString) return ''
    const date = new Date(dateString)
    
    const datePart = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    if (includeTime) {
        const timePart = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })
        return `${datePart} ${timePart}`
    }
    
    return datePart
}