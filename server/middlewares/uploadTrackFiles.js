import { upload } from '../configs/multer.js';
import multer from 'multer';

export const uploadTrackFiles = (req, res, next) => {
    const uploadFields = upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'song_url', maxCount: 1 }
    ]);

    uploadFields(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ errorMessage: `Ошибка Multer: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ errorMessage: err.message });
        }
        
        if (!req.files?.song_url && req.method === 'POST') {
            return res.status(400).json({ errorMessage: 'Файл трека обязателен' });
        }

        next();
    });
};