import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
    if (!filePath) return;

    let cleanPath = filePath;
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        try {
            const url = new URL(filePath);
            cleanPath = url.pathname.replace(/^\/+/, '');
        } catch (e) {
            console.error(`Не удалось распарсить URL файла: ${filePath}`, e);
            return;
        }
    }

    const fullPath = path.resolve(cleanPath);

    if (fullPath.includes('default') || fullPath.includes('placeholder')) {
        return; 
    }

    try {
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Файл успешно удален: ${cleanPath}`);
        }
    } catch (err) {
        console.error(`Ошибка при удалении файла по пути ${fullPath}:`, err);
    }
};