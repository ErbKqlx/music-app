import { upload } from '../configs/multer.js';
import multer from 'multer';


export const uploadAvatar = (req, res, next) => {
    const uploadSingle = upload.single('avatar');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ errorMessage: `Ошибка загрузки аватарки: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ errorMessage: err.message });
        }
        
        next();
    });
};