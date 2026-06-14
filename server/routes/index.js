import UserController from "../controllers/userController.js"
import AuthController from "../controllers/authController.js"
import express from 'express'
import verifySignUp from "../middlewares/verifySignUp.js"
import authJwt from "../middlewares/authJwt.js"
import PlaylistController from "../controllers/playlistController.js"
import SongController from "../controllers/songController.js"
import db from "../models/index.js"
import SearchController from "../controllers/searchController.js"
import { upload } from "../configs/multer.js"
import { uploadImage } from "../middlewares/uploadImage.js"
import { uploadTrackFiles } from "../middlewares/uploadTrackFiles.js"
import GenreController from "../controllers/genreController.js"
import ArtistController from "../controllers/artistController.js"
import CommentController from "../controllers/commentController.js"
import { uploadAvatar } from "../middlewares/uploadAvatar.js"
import RoleController from "../controllers/roleController.js"
import ReportTypeController from "../controllers/reportTypeController.js"

const router = express.Router()

const Song = db.song
const Artist = db.artist

router.get(
    '/roles',
    authJwt.verifyToken,
    authJwt.checkRole(['Администратор']),
    RoleController.getRoles
)

router.get(
    '/users', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Модератор', 'Администратор']), 
    UserController.getUsers
)

router.get(
    '/users/:id', 
    [authJwt.verifyToken], 
    UserController.getUserData
)

router.patch(
    '/users/:id', 
    authJwt.verifyToken, 
    uploadAvatar,
    UserController.updateUserData
)

router.patch(
    '/users/:id/role', 
    authJwt.verifyToken,
    authJwt.checkRole(['Администратор']), 
    
    UserController.updateUserRole
)

router.get('/users/:id/playlists', [authJwt.verifyToken], PlaylistController.getPlaylists)
router.get('/playlist/:id', [authJwt.verifyToken], PlaylistController.getOnePlaylist)
// router.get('/playlist/:id/songs', [authJwt.verifyToken], PlaylistController.getPlaylistSongs)
router.post('/playlist', authJwt.verifyToken, uploadImage, PlaylistController.createPlaylist)
router.patch('/playlist/:id', authJwt.verifyToken, uploadImage, PlaylistController.updatePlaylist)
router.delete('/playlist/:id', authJwt.verifyToken, PlaylistController.deletePlaylist)

router.delete('/playlist/:id_playlist/song/:id_song', [authJwt.verifyToken], PlaylistController.deleteSongFromPlaylist)
router.post('/playlist/:id_playlist/song/:id_song', [authJwt.verifyToken], PlaylistController.addSongToPlaylist)

router.get(
    '/artists/:id', 
    authJwt.verifyToken, 
    ArtistController.getArtist
)

router.patch(
    '/artists/:id', 
    authJwt.verifyToken, 
    ArtistController.updateArtist
)

router.post(
    '/song', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Исполнитель', 'Администратор']), 
    uploadTrackFiles, 
    SongController.createSong
)

router.patch(
    '/song/:id', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Исполнитель', 'Модератор', 'Администратор']), 
    uploadTrackFiles, 
    SongController.updateSong
)

router.delete(
    '/song/:id', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Исполнитель', 'Модератор', 'Администратор']), 
    SongController.deleteSong
)

router.get(
    '/song/:id', 
    authJwt.verifyToken, 
    SongController.getOneSong
)

router.get(
    '/song/:id/comments',
    authJwt.verifyToken, 
    CommentController.getSongComments
)

router.post(
    '/song/:id/comments',
    authJwt.verifyToken, 
    CommentController.addComment
)

router.get(
    '/songs',
    authJwt.verifyToken, 
    SongController.getSongs
)

router.patch(
    '/comments/:id',
    authJwt.verifyToken, 
    CommentController.updateComment
)

router.delete(
    '/comments/:id',
    authJwt.verifyToken, 
    CommentController.deleteComment
)

router.get(
    '/report-types',
    authJwt.verifyToken, 
    ReportTypeController.getReportTypes
)

router.post(
    '/report-types',
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']),
    ReportTypeController.addReportType
)

router.patch(
    '/report-types/:id',
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']),
    ReportTypeController.updateReportType
)

router.delete(
    '/report-types/:id',
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']),
    ReportTypeController.deleteReportType
)

router.get(
    '/comments/my',
    authJwt.verifyToken, 
    CommentController.getUserComments
)

router.post('/song/:id/listen', SongController.trackListen)

router.get('/songs/new', SongController.getNewSongs)
router.get('/songs/popular', SongController.getPopularSongs)
router.get('/songs/history', authJwt.verifyToken, SongController.getSongsHistory)


router.get('/search', [authJwt.verifyToken], SearchController.search)

router.get(
    '/genres/:id', 
    GenreController.getOneGenre
)

router.get(
    '/genres', 
    GenreController.getGenres
)

router.post(
    '/genres', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']),  
    GenreController.addGenre
)

router.patch(
    '/genres/:id', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']), 
    GenreController.updateGenre
)

router.delete(
    '/genres/:id', 
    authJwt.verifyToken, 
    authJwt.checkRole(['Администратор']), 
    GenreController.deleteGenre
)

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/verify-code', AuthController.verifyCode);

export default router