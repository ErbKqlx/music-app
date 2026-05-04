export function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}