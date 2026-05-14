import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
    if (!filePath) return;

    const fullPath = path.resolve(filePath);

    if (fs.existsSync(fullPath) && !fullPath.includes('default')) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error(`Ошибка при удалении файла: ${err}`);
        });
    }
};