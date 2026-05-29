import fs from 'fs';

const host = 'http://localhost:8080';

export const getFileUrl = (relativePath, defaultPath = 'uploads/default/placeholder.webp') => {
    const cleanPath = relativePath ? relativePath.replace(/^\/+/, '') : null;
    const cleanDefault = defaultPath.replace(/^\/+/, '');

    if (cleanPath && fs.existsSync(cleanPath)) {
        return `${host}/${cleanPath}`;
    }
    
    return `${host}/${cleanDefault}`;
};