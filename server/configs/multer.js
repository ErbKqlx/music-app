import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = '';

        if (file.fieldname === 'song_url') {
            dir = 'uploads/sounds';
        } else if (file.fieldname === 'image') {
            dir = 'uploads/covers'; 
        } else if (file.fieldname === 'avatar') {
            dir = 'uploads/avatars';
        } else {
            dir = 'uploads/misc';
        }

        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (err) {
            cb(err, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
        const allowedAudio = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'];

        if (file.fieldname === 'image' || file.fieldname === 'avatar') {
            if (allowedImages.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Недопустимый формат изображения. Разрешены: jpg, png, webp'), false);
            }
        } 
        else if (file.fieldname === 'song_url') {
            if (allowedAudio.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Недопустимый формат аудио'), false);
            }
        } 
        else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});