import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'song_url') {
            cb(null, 'uploads/sounds');
        } else if (file.fieldname === 'image') {
            cb(null, 'uploads/covers'); 
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

        if (file.fieldname === 'image') {
            if (allowedImages.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Недопустимый формат изображения. Разрешены: jpg, png, webp'), false);
            }
        } else if (file.fieldname === 'song_url') {
            if (allowedAudio.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Недопустимый формат аудио'), false);
            }
        } else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/playlists');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// export const upload = multer(
//     { storage: storage,
//      fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Недопустимый тип файла. Разрешены только изображения (jpg, png, webp)'), false);
//         }
//     },
//     limits: {
//         fileSize: 20 * 1024 * 1024
//     }}
// );