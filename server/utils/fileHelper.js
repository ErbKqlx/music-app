import fs from 'fs';

const host = 'http://localhost:8080';

export const getFileUrl = (relativePath, defaultPath = 'uploads/default/placeholder.webp') => {
    if (!relativePath) {
        return `${host}/${defaultPath.replace(/^\/+/, '')}`;
    }

    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }

    const cleanPath = relativePath.replace(/^\/+/, '');
    const cleanDefault = defaultPath.replace(/^\/+/, '');

    try {
        if (fs.existsSync(cleanPath)) {
            return `${host}/${cleanPath}`;
        }
    } catch (err) {
        console.error(`Ошибка проверки файла ${cleanPath}:`, err);
    }
    
    return `${host}/${cleanDefault}`;
};