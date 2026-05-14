import { upload } from '../configs/multer.js';
import multer from 'multer';

export const uploadImage = (req, res, next) => {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ errorMessage: `Ошибка загрузки: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ errorMessage: err.message });
        }
        
        next();
    });
};